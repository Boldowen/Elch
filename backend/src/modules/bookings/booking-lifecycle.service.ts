import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  BookingActorType,
  BookingStatus,
  MessageType,
  NotificationType,
  Prisma,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class BookingLifecycleService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE, { name: 'booking-lifecycle' })
  async handleCron() {
    await this.runOnce(new Date());
  }

  async runOnce(now: Date) {
    const [expired, started, completed] = await Promise.all([
      this.prisma.booking.findMany({
        where: { status: BookingStatus.PENDING, expiresAt: { lte: now }, deletedAt: null },
        select: { id: true },
        take: 100,
      }),
      this.prisma.booking.findMany({
        where: { status: BookingStatus.CONFIRMED, startsAt: { lte: now }, deletedAt: null },
        select: { id: true },
        take: 100,
      }),
      this.prisma.booking.findMany({
        where: { status: BookingStatus.IN_PROGRESS, endsAt: { lte: now }, deletedAt: null },
        select: { id: true },
        take: 100,
      }),
    ]);

    const results = await Promise.all([
      ...expired.map(({ id }) => this.transition(id, BookingStatus.PENDING, BookingStatus.EXPIRED, 'EXPIRED', now)),
      ...started.map(({ id }) => this.transition(id, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, 'STARTED_AUTOMATICALLY', now)),
      ...completed.map(({ id }) => this.transition(id, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED, 'COMPLETED_AUTOMATICALLY', now)),
    ]);
    return { transitioned: results.filter(Boolean).length };
  }

  private async transition(
    bookingId: string,
    fromStatus: BookingStatus,
    toStatus: BookingStatus,
    eventType: string,
    now: Date,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        select: {
          travelerId: true,
          guideId: true,
          listingId: true,
          startsAt: true,
          endsAt: true,
          listing: { select: { hostId: true } },
        },
      });
      if (!booking) return false;
      const changed = await tx.booking.updateMany({
        where: { id: bookingId, status: fromStatus, deletedAt: null },
        data: { status: toStatus },
      });
      if (changed.count !== 1) return false;

      if (toStatus === BookingStatus.EXPIRED && booking.listingId) {
        for (const date of this.inventoryDates(booking.startsAt, booking.endsAt)) {
          await tx.listingInventory.updateMany({
            where: { listingId: booking.listingId, date, reservedUnits: { gt: 0 } },
            data: { reservedUnits: { decrement: 1 }, availableUnits: { increment: 1 } },
          });
        }
      }

      await tx.bookingEvent.create({
        data: {
          bookingId,
          actorType: BookingActorType.SYSTEM,
          fromStatus,
          toStatus,
          eventType,
          metadata: { processedAt: now.toISOString() },
        },
      });
      const conversation = await tx.conversation.findUnique({
        where: { bookingId },
        select: { id: true },
      });
      if (conversation) {
        await tx.message.create({
          data: {
            conversationId: conversation.id,
            senderId: booking.travelerId,
            type: MessageType.SYSTEM,
            body: toStatus === BookingStatus.EXPIRED
              ? 'Booking request expired'
              : toStatus === BookingStatus.IN_PROGRESS
                ? 'Booking started'
                : 'Booking completed',
          },
        });
      }
      const providerId = booking.guideId ?? booking.listing?.hostId;
      const notification = toStatus === BookingStatus.EXPIRED
        ? { type: NotificationType.BOOKING_EXPIRED, title: 'Booking expired', body: 'Booking request expired' }
        : toStatus === BookingStatus.IN_PROGRESS
          ? { type: NotificationType.BOOKING_STARTED, title: 'Booking started', body: 'Your booking has started' }
          : { type: NotificationType.BOOKING_COMPLETED, title: 'Booking completed', body: 'Your booking is complete. You can now leave a review.' };
      const recipients = [...new Set([booking.travelerId, providerId].filter((id): id is string => Boolean(id)))];
      await tx.notification.createMany({
        data: recipients.map((userId) => ({
          userId,
          type: notification.type,
          title: notification.title,
          body: notification.body,
          data: { bookingId },
        })),
      });
      if (toStatus === BookingStatus.COMPLETED && booking.guideId) {
        await tx.guideProfile.updateMany({
          where: { userId: booking.guideId },
          data: { completedTrips: { increment: 1 } },
        });
      }
      return true;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
  }

  private inventoryDates(startsAt: Date, endsAt: Date) {
    const dates: Date[] = [];
    const cursor = new Date(Date.UTC(startsAt.getUTCFullYear(), startsAt.getUTCMonth(), startsAt.getUTCDate()));
    const exclusiveEnd = new Date(Date.UTC(endsAt.getUTCFullYear(), endsAt.getUTCMonth(), endsAt.getUTCDate()));
    do {
      dates.push(new Date(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    } while (cursor < exclusiveEnd);
    return dates;
  }
}
