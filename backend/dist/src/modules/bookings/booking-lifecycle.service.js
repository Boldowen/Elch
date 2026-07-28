var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingActorType, BookingStatus, MessageType, Prisma, } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
let BookingLifecycleService = class BookingLifecycleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleCron() {
        await this.runOnce(new Date());
    }
    async runOnce(now) {
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
    async transition(bookingId, fromStatus, toStatus, eventType, now) {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({
                where: { id: bookingId },
                select: { travelerId: true, guideId: true, listingId: true, startsAt: true, endsAt: true },
            });
            if (!booking)
                return false;
            const changed = await tx.booking.updateMany({
                where: { id: bookingId, status: fromStatus, deletedAt: null },
                data: { status: toStatus },
            });
            if (changed.count !== 1)
                return false;
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
            if (toStatus === BookingStatus.COMPLETED && booking.guideId) {
                await tx.guideProfile.updateMany({
                    where: { userId: booking.guideId },
                    data: { completedTrips: { increment: 1 } },
                });
            }
            return true;
        }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
    }
    inventoryDates(startsAt, endsAt) {
        const dates = [];
        const cursor = new Date(Date.UTC(startsAt.getUTCFullYear(), startsAt.getUTCMonth(), startsAt.getUTCDate()));
        const exclusiveEnd = new Date(Date.UTC(endsAt.getUTCFullYear(), endsAt.getUTCMonth(), endsAt.getUTCDate()));
        do {
            dates.push(new Date(cursor));
            cursor.setUTCDate(cursor.getUTCDate() + 1);
        } while (cursor < exclusiveEnd);
        return dates;
    }
};
__decorate([
    Cron(CronExpression.EVERY_MINUTE, { name: 'booking-lifecycle' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingLifecycleService.prototype, "handleCron", null);
BookingLifecycleService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], BookingLifecycleService);
export { BookingLifecycleService };
//# sourceMappingURL=booking-lifecycle.service.js.map