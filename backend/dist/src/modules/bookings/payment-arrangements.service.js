var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, PaymentArrangement, PaymentStatus, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
let PaymentArrangementsService = class PaymentArrangementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async propose(userId, bookingId, dto) {
        if (dto.arrangement === PaymentArrangement.ONLINE_PAYMENT) {
            throw new ConflictException({ code: 'ONLINE_PAYMENT_DISABLED', message: 'Online payment is not enabled during the pilot' });
        }
        const participant = await this.participant(userId, bookingId);
        if (participant.booking.status !== BookingStatus.CONFIRMED && participant.booking.status !== BookingStatus.IN_PROGRESS) {
            throw new ConflictException('Payment arrangement can only be changed for a confirmed or active booking');
        }
        const existing = await this.prisma.pilotPayment.findUnique({ where: { bookingId } });
        if (existing?.status === PaymentStatus.PAID)
            throw new ConflictException('Paid arrangements cannot be changed');
        const now = new Date();
        return this.prisma.pilotPayment.upsert({
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
    }
    async agree(userId, bookingId) {
        return this.prisma.$transaction(async (tx) => {
            const participant = await this.participant(userId, bookingId, tx);
            const payment = await tx.pilotPayment.findUnique({ where: { bookingId } });
            if (!payment)
                throw new NotFoundException('Payment arrangement not found');
            if (payment.status === PaymentStatus.PAID)
                return payment;
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
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    }
    async markPaid(userId, bookingId) {
        const participant = await this.participant(userId, bookingId);
        if (!participant.isProvider)
            throw new ForbiddenException('Only the provider can confirm receipt of payment');
        const changed = await this.prisma.pilotPayment.updateMany({
            where: { bookingId, status: PaymentStatus.AGREED },
            data: { status: PaymentStatus.PAID, paidAt: new Date() },
        });
        if (!changed.count)
            throw new ConflictException('Both parties must agree before payment can be marked paid');
        return this.prisma.pilotPayment.findUnique({ where: { bookingId } });
    }
    async participant(userId, bookingId, client = this.prisma) {
        const booking = await client.booking.findFirst({
            where: { id: bookingId, deletedAt: null },
            select: { id: true, travelerId: true, guideId: true, status: true, listing: { select: { hostId: true } } },
        });
        if (!booking)
            throw new NotFoundException('Booking not found');
        const isTraveler = booking.travelerId === userId;
        const isProvider = booking.guideId === userId || booking.listing?.hostId === userId;
        if (!isTraveler && !isProvider)
            throw new ForbiddenException('Not a booking participant');
        return { booking, isTraveler, isProvider };
    }
};
PaymentArrangementsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], PaymentArrangementsService);
export { PaymentArrangementsService };
//# sourceMappingURL=payment-arrangements.service.js.map