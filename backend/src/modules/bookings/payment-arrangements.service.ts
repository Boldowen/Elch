import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, PaymentArrangement, PaymentStatus, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProposePaymentArrangementDto } from './dto/payment-arrangement.dto.js';

@Injectable()
export class PaymentArrangementsService {
  constructor(private readonly prisma: PrismaService) {}

  async propose(userId: string, bookingId: string, dto: ProposePaymentArrangementDto) {
    if (dto.arrangement === PaymentArrangement.ONLINE_PAYMENT) {
      throw new ConflictException({ code: 'ONLINE_PAYMENT_DISABLED', message: 'Online payment is not enabled during the pilot' });
    }
    return this.prisma.$transaction(async (tx) => {
      const participant = await this.participant(userId, bookingId, tx);
      if (participant.booking.status !== BookingStatus.CONFIRMED && participant.booking.status !== BookingStatus.IN_PROGRESS) {
        throw new ConflictException('Payment arrangement can only be changed for a confirmed or active booking');
      }
      const existing = await tx.pilotPayment.findUnique({ where: { bookingId } });
      if (existing?.status === PaymentStatus.PAID) throw new ConflictException('Paid arrangements cannot be changed');
      const now = new Date();
      return tx.pilotPayment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        arrangement: dto.arrangement,
        instructions: dto.instructions?.trim() || null,
        proposedById: userId,
        agreedByTravelerAt: participant.isTraveler ? now : null,
        agreedByProviderAt: participant.isProvider ? now : null,
      },
      update: {
        arrangement: dto.arrangement,
        status: PaymentStatus.PENDING,
        instructions: dto.instructions?.trim() || null,
        proposedById: userId,
        agreedByTravelerAt: participant.isTraveler ? now : null,
        agreedByProviderAt: participant.isProvider ? now : null,
        paidAt: null,
      },
      });
    });
  }

  async agree(userId: string, bookingId: string) {
    return this.prisma.$transaction(async (tx) => {
      const participant = await this.participant(userId, bookingId, tx);
      this.assertPayable(participant.booking.status);
      const payment = await tx.pilotPayment.findUnique({ where: { bookingId } });
      if (!payment) throw new NotFoundException('Payment arrangement not found');
      if (payment.status === PaymentStatus.PAID) return payment;
      if (payment.status !== PaymentStatus.PENDING && payment.status !== PaymentStatus.AGREED) {
        throw new ConflictException('Payment arrangement cannot be agreed in its current state');
      }
      const now = new Date();
      await tx.pilotPayment.update({
        where: { bookingId },
        data: {
          agreedByTravelerAt: participant.isTraveler ? now : undefined,
          agreedByProviderAt: participant.isProvider ? now : undefined,
        },
      });
      const agreed = await tx.pilotPayment.findUniqueOrThrow({ where: { bookingId } });
      if (agreed.agreedByTravelerAt && agreed.agreedByProviderAt && agreed.status !== PaymentStatus.AGREED) {
        return tx.pilotPayment.update({ where: { bookingId }, data: { status: PaymentStatus.AGREED } });
      }
      return agreed;
    });
  }

  async markPaid(userId: string, bookingId: string) {
    return this.prisma.$transaction(async (tx) => {
      const participant = await this.participant(userId, bookingId, tx);
      if (!participant.isProvider) throw new ForbiddenException('Only the provider can confirm receipt of payment');
      this.assertPayable(participant.booking.status);
      const payment = await tx.pilotPayment.findUnique({ where: { bookingId } });
      if (payment?.status === PaymentStatus.PAID) return payment;
      const changed = await tx.pilotPayment.updateMany({
        where: { bookingId, status: PaymentStatus.AGREED },
        data: { status: PaymentStatus.PAID, paidAt: new Date() },
      });
      if (!changed.count) throw new ConflictException('Both parties must agree before payment can be marked paid');
      return tx.pilotPayment.findUnique({ where: { bookingId } });
    });
  }

  private assertPayable(status: BookingStatus) {
    if (status !== BookingStatus.CONFIRMED && status !== BookingStatus.IN_PROGRESS && status !== BookingStatus.COMPLETED) {
      throw new ConflictException({ code: 'PAYMENT_BOOKING_INACTIVE', message: 'Payment requires a confirmed, active, or completed booking' });
    }
  }

  private async participant(userId: string, bookingId: string, client: Prisma.TransactionClient) {
    // Every payment mutation locks the booking first, serializing changes with
    // other payment operations and booking cancellation/completion.
    await client.$queryRaw`SELECT "id" FROM "Booking" WHERE "id" = ${bookingId}::uuid FOR UPDATE`;
    const booking = await client.booking.findFirst({
      where: { id: bookingId, deletedAt: null },
      select: { id: true, travelerId: true, guideId: true, status: true, listing: { select: { hostId: true } } },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    const isTraveler = booking.travelerId === userId;
    const isProvider = booking.guideId === userId || booking.listing?.hostId === userId;
    if (!isTraveler && !isProvider) throw new ForbiddenException('Not a booking participant');
    return { booking, isTraveler, isProvider };
  }
}
