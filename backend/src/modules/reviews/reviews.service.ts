import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { RankingService } from '../ranking/ranking.service.js';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService, private readonly ranking: RankingService) {}

  list(query: { guideId?: string; listingId?: string }) {
    if (Boolean(query.guideId) === Boolean(query.listingId)) {
      throw new BadRequestException('Choose exactly one guide or listing');
    }
    return this.prisma.review.findMany({
      where: {
        deletedAt: null,
        ...(query.guideId ? { guideId: query.guideId } : { listingId: query.listingId }),
        bookingId: { not: null },
      },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async create(authorId: string, dto: CreateReviewDto) {
    try {
      const review = await this.prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findFirst({
          where: { id: dto.bookingId, deletedAt: null },
          select: { id: true, travelerId: true, guideId: true, listingId: true, status: true },
        });
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.travelerId !== authorId) throw new ConflictException({ code: 'REVIEW_NOT_ALLOWED', message: 'Only the booking traveler can leave a review' });
        if (booking.status !== BookingStatus.COMPLETED) throw new ConflictException({ code: 'REVIEW_NOT_ALLOWED', message: 'Only completed bookings can be reviewed' });

        const review = await tx.review.create({
          data: {
            bookingId: booking.id,
            authorId,
            guideId: booking.guideId,
            listingId: booking.listingId,
            rating: dto.rating,
            text: dto.text.trim(),
          },
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
        });
        if (booking.guideId) {
          const aggregate = await tx.review.aggregate({ where: { guideId: booking.guideId, bookingId: { not: null }, deletedAt: null }, _avg: { rating: true }, _count: { rating: true } });
          await tx.guideProfile.updateMany({
            where: { userId: booking.guideId },
            data: { rating: aggregate._avg.rating?.toString() ?? '0', reviewCount: aggregate._count.rating },
          });
        } else if (booking.listingId) {
          const aggregate = await tx.review.aggregate({ where: { listingId: booking.listingId, bookingId: { not: null }, deletedAt: null }, _avg: { rating: true }, _count: { rating: true } });
          await tx.listing.update({
            where: { id: booking.listingId },
            data: { rating: aggregate._avg.rating?.toString() ?? '0', reviewCount: aggregate._count.rating },
          });
        }
        return review;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      if (review.guideId) await this.ranking.recalculateGuide(review.guideId);
      return review;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException({ code: 'REVIEW_ALREADY_EXISTS', message: 'This booking has already been reviewed' });
      }
      throw error;
    }
  }
}
