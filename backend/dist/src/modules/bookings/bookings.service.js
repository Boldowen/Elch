var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { BookingActorType, BookingStatus, CancellationPolicyType, GuideStatus, MessageType, NotificationType, Prisma, } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { BookingAction } from './dto/update-booking-status.dto.js';
import { PricingService } from '../pricing/pricing.service.js';
const ACTIVE_STATUSES = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.IN_PROGRESS,
];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const includeBooking = {
    listing: { include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } } },
    guide: { select: { id: true, name: true, avatarUrl: true } },
    review: { select: { id: true, rating: true, createdAt: true } },
    payment: true,
};
let BookingsService = class BookingsService {
    prisma;
    pricing;
    constructor(prisma, pricing) {
        this.prisma = prisma;
        this.pricing = pricing;
    }
    listTraveler(userId) {
        return this.prisma.booking.findMany({
            where: { travelerId: userId, deletedAt: null },
            include: includeBooking,
            orderBy: { startsAt: 'asc' },
        });
    }
    listProvider(userId) {
        return this.prisma.booking.findMany({
            where: {
                deletedAt: null,
                status: { not: BookingStatus.DRAFT },
                OR: [{ guideId: userId }, { listing: { hostId: userId } }],
            },
            include: { ...includeBooking, traveler: { select: { id: true, name: true, avatarUrl: true } } },
            orderBy: { startsAt: 'asc' },
        });
    }
    listDrafts(userId) {
        return this.prisma.booking.findMany({
            where: { travelerId: userId, status: BookingStatus.DRAFT, deletedAt: null },
            include: includeBooking,
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getOwned(userId, bookingId) {
        const booking = await this.prisma.booking.findFirst({
            where: { id: bookingId, travelerId: userId, deletedAt: null },
            include: includeBooking,
        });
        if (!booking)
            throw new NotFoundException('Booking not found');
        return booking;
    }
    async quote(userId, dto) {
        if (Boolean(dto.listingId) === Boolean(dto.guideId)) {
            throw new BadRequestException('Choose exactly one listing or guide');
        }
        const startsAt = new Date(dto.startsAt);
        const endsAt = new Date(dto.endsAt);
        if (endsAt <= startsAt)
            throw new BadRequestException('End time must be after start time');
        if (dto.listingId) {
            const listing = await this.prisma.listing.findFirst({
                where: { id: dto.listingId, published: true, deletedAt: null },
            });
            if (!listing)
                throw new NotFoundException('Listing not found');
            if (listing.hostId === userId)
                throw new ConflictException({ code: 'SELF_BOOKING_NOT_ALLOWED', message: 'You cannot book your own listing' });
            const units = Math.max(1, Math.ceil((endsAt.getTime() - startsAt.getTime()) / 86_400_000));
            return this.pricing.calculate({
                basePriceMinor: listing.basePriceMinor,
                units,
                guests: dto.guests,
                currency: listing.currency,
                cleaningFeeMinor: listing.cleaningFeeMinor,
                serviceFeeMinor: listing.serviceFeeMinor,
                taxMinor: listing.taxMinor,
                extraGuestFeeMinor: listing.extraGuestFeeMinor,
                depositMinor: listing.depositMinor,
            });
        }
        if (dto.guideId === userId)
            throw new ConflictException({ code: 'SELF_BOOKING_NOT_ALLOWED', message: 'You cannot book yourself as a guide' });
        const guide = await this.prisma.guideProfile.findFirst({
            where: { userId: dto.guideId, status: GuideStatus.APPROVED, verified: true, deletedAt: null },
        });
        if (!guide?.price)
            throw new NotFoundException('Bookable guide not found');
        const units = Math.max(1, Math.ceil((endsAt.getTime() - startsAt.getTime()) / 3_600_000));
        return this.pricing.calculate({
            basePriceMinor: this.pricing.decimalToMinor(guide.price),
            units,
            guests: dto.guests,
            currency: 'USD',
        });
    }
    async create(userId, dto, idempotencyKey) {
        if (!idempotencyKey || !UUID.test(idempotencyKey)) {
            throw new BadRequestException({
                code: 'IDEMPOTENCY_KEY_REQUIRED',
                message: 'A valid UUID Idempotency-Key header is required',
            });
        }
        if (Boolean(dto.listingId) === Boolean(dto.guideId)) {
            throw new BadRequestException('Choose exactly one listing or guide');
        }
        const startsAt = new Date(dto.startsAt);
        const endsAt = new Date(dto.endsAt);
        if (endsAt <= startsAt)
            throw new BadRequestException('End time must be after start time');
        if (startsAt.getTime() < Date.now() - 5 * 60_000) {
            throw new BadRequestException('Booking start time must be in the future');
        }
        const requestHash = createHash('sha256')
            .update(JSON.stringify({ ...dto, note: dto.note?.trim() || null }))
            .digest('hex');
        const prior = await this.prisma.idempotencyKey.findUnique({
            where: { userId_key: { userId, key: idempotencyKey } },
        });
        if (prior)
            return this.replay(prior.requestHash, requestHash, prior.responseBody);
        try {
            return await this.prisma.$transaction(async (tx) => {
                await tx.idempotencyKey.create({
                    data: {
                        key: idempotencyKey,
                        userId,
                        requestHash,
                        expiresAt: new Date(Date.now() + 24 * 60 * 60_000),
                    },
                });
                let price;
                let providerId;
                let title;
                if (dto.listingId) {
                    const listing = await tx.listing.findFirst({
                        where: { id: dto.listingId, published: true, deletedAt: null },
                    });
                    if (!listing)
                        throw new NotFoundException('Listing not found');
                    if (listing.hostId === userId) {
                        throw new ConflictException({ code: 'SELF_BOOKING_NOT_ALLOWED', message: 'You cannot book your own listing' });
                    }
                    const nights = Math.max(1, Math.ceil((endsAt.getTime() - startsAt.getTime()) / 86_400_000));
                    price = this.pricing.calculate({
                        basePriceMinor: listing.basePriceMinor,
                        units: nights,
                        guests: dto.guests,
                        currency: listing.currency,
                        cleaningFeeMinor: listing.cleaningFeeMinor,
                        serviceFeeMinor: listing.serviceFeeMinor,
                        taxMinor: listing.taxMinor,
                        extraGuestFeeMinor: listing.extraGuestFeeMinor,
                        depositMinor: listing.depositMinor,
                    });
                    providerId = listing.hostId;
                    title = listing.title;
                    await this.reserveListingInventory(tx, listing.id, startsAt, endsAt, listing.defaultTotalUnits);
                }
                else {
                    if (dto.guideId === userId) {
                        throw new ConflictException({ code: 'SELF_BOOKING_NOT_ALLOWED', message: 'You cannot book yourself as a guide' });
                    }
                    const guide = await tx.guideProfile.findFirst({
                        where: { userId: dto.guideId, status: GuideStatus.APPROVED, verified: true, deletedAt: null },
                        include: { user: { select: { name: true } } },
                    });
                    if (!guide?.price)
                        throw new NotFoundException('Bookable guide not found');
                    const hours = Math.max(1, Math.ceil((endsAt.getTime() - startsAt.getTime()) / 3_600_000));
                    price = this.pricing.calculate({
                        basePriceMinor: this.pricing.decimalToMinor(guide.price),
                        units: hours,
                        guests: dto.guests,
                        currency: 'USD',
                    });
                    providerId = guide.userId;
                    title = `Guide: ${guide.user.name}`;
                }
                const overlap = dto.guideId ? await tx.booking.findFirst({
                    where: {
                        deletedAt: null,
                        status: { in: ACTIVE_STATUSES },
                        startsAt: { lt: endsAt },
                        endsAt: { gt: startsAt },
                        guideId: dto.guideId,
                    },
                    select: { id: true },
                }) : null;
                if (overlap)
                    this.unavailable();
                const booking = await tx.booking.create({
                    data: {
                        travelerId: userId,
                        listingId: dto.listingId,
                        guideId: dto.guideId,
                        startsAt,
                        endsAt,
                        guests: dto.guests,
                        amount: this.pricing.minorToDecimal(price.amountMinor),
                        amountMinor: price.amountMinor,
                        baseAmountMinor: price.baseAmountMinor,
                        cleaningFeeMinor: price.cleaningFeeMinor,
                        serviceFeeMinor: price.serviceFeeMinor,
                        taxMinor: price.taxMinor,
                        extraGuestFeeMinor: price.extraGuestFeeMinor,
                        depositMinor: price.depositMinor,
                        currency: price.currency,
                        note: dto.note?.trim() || null,
                        status: BookingStatus.PENDING,
                        expiresAt: new Date(Math.min(startsAt.getTime(), Date.now() + 24 * 60 * 60_000)),
                        cancellationPolicy: CancellationPolicyType.FLEXIBLE,
                        freeCancellationUntil: new Date(startsAt.getTime() - 24 * 60 * 60_000),
                        lateCancellationPercent: 20,
                        noShowPercent: 100,
                        events: {
                            create: {
                                actorId: userId,
                                actorType: BookingActorType.TRAVELER,
                                toStatus: BookingStatus.PENDING,
                                eventType: 'SUBMITTED',
                            },
                        },
                        conversation: {
                            create: {
                                title,
                                participants: { create: [{ userId }, { userId: providerId }] },
                                messages: {
                                    create: { senderId: userId, type: MessageType.SYSTEM, body: 'Booking request sent' },
                                },
                            },
                        },
                    },
                    include: includeBooking,
                });
                await tx.notification.create({
                    data: {
                        userId: providerId,
                        type: NotificationType.BOOKING_CREATED,
                        title: 'New booking request',
                        body: `${title} received a new booking request`,
                        data: { bookingId: booking.id },
                    },
                });
                await tx.idempotencyKey.update({
                    where: { userId_key: { userId, key: idempotencyKey } },
                    data: { responseBody: JSON.parse(JSON.stringify(booking)), statusCode: 201 },
                });
                return booking;
            }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
        }
        catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException)
                throw error;
            const raced = await this.prisma.idempotencyKey.findUnique({
                where: { userId_key: { userId, key: idempotencyKey } },
            });
            if (raced?.responseBody)
                return this.replay(raced.requestHash, requestHash, raced.responseBody);
            const message = error instanceof Error ? error.message : '';
            if (message.includes('no_overlap') || message.includes('exclusion') || message.includes('Transaction failed')) {
                this.unavailable();
            }
            throw error;
        }
    }
    async createDraft(userId, dto, idempotencyKey) {
        if (!idempotencyKey || !UUID.test(idempotencyKey)) {
            throw new BadRequestException({
                code: 'IDEMPOTENCY_KEY_REQUIRED',
                message: 'A valid UUID Idempotency-Key header is required',
            });
        }
        this.assertProviderSelection(dto);
        const { startsAt, endsAt } = this.parseFutureDates(dto.startsAt, dto.endsAt);
        const requestHash = createHash('sha256')
            .update(JSON.stringify({ operation: 'CREATE_BOOKING_DRAFT', ...dto, note: dto.note?.trim() || null }))
            .digest('hex');
        const prior = await this.prisma.idempotencyKey.findUnique({
            where: { userId_key: { userId, key: idempotencyKey } },
        });
        if (prior)
            return this.replay(prior.requestHash, requestHash, prior.responseBody);
        try {
            return await this.prisma.$transaction(async (tx) => {
                await tx.idempotencyKey.create({
                    data: {
                        key: idempotencyKey,
                        userId,
                        requestHash,
                        expiresAt: new Date(Date.now() + 24 * 60 * 60_000),
                    },
                });
                const price = await this.priceDraft(tx, userId, dto, startsAt, endsAt);
                const draft = await tx.booking.create({
                    data: {
                        travelerId: userId,
                        listingId: dto.listingId,
                        guideId: dto.guideId,
                        startsAt,
                        endsAt,
                        guests: dto.guests,
                        amount: this.pricing.minorToDecimal(price.amountMinor),
                        amountMinor: price.amountMinor,
                        baseAmountMinor: price.baseAmountMinor,
                        cleaningFeeMinor: price.cleaningFeeMinor,
                        serviceFeeMinor: price.serviceFeeMinor,
                        taxMinor: price.taxMinor,
                        extraGuestFeeMinor: price.extraGuestFeeMinor,
                        depositMinor: price.depositMinor,
                        currency: price.currency,
                        note: dto.note?.trim() || null,
                        status: BookingStatus.DRAFT,
                        expiresAt: null,
                        cancellationPolicy: CancellationPolicyType.FLEXIBLE,
                        freeCancellationUntil: null,
                        lateCancellationPercent: 0,
                        noShowPercent: 0,
                    },
                    include: includeBooking,
                });
                await tx.idempotencyKey.update({
                    where: { userId_key: { userId, key: idempotencyKey } },
                    data: { responseBody: JSON.parse(JSON.stringify(draft)), statusCode: 201 },
                });
                return draft;
            }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
        }
        catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException)
                throw error;
            const raced = await this.prisma.idempotencyKey.findUnique({
                where: { userId_key: { userId, key: idempotencyKey } },
            });
            if (raced?.responseBody)
                return this.replay(raced.requestHash, requestHash, raced.responseBody);
            throw error;
        }
    }
    async submitDraft(userId, bookingId) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const draft = await tx.booking.findFirst({
                    where: { id: bookingId, travelerId: userId, deletedAt: null },
                });
                if (!draft)
                    throw new NotFoundException('Booking draft not found');
                if (draft.status !== BookingStatus.DRAFT) {
                    throw new ConflictException({
                        code: 'BOOKING_DRAFT_ALREADY_SUBMITTED',
                        message: 'Only a draft booking can be submitted',
                    });
                }
                const { startsAt, endsAt } = this.parseFutureDates(draft.startsAt, draft.endsAt);
                let price;
                let providerId;
                let title;
                if (draft.listingId) {
                    const listing = await tx.listing.findFirst({
                        where: { id: draft.listingId, published: true, deletedAt: null },
                    });
                    if (!listing)
                        throw new NotFoundException('Listing is no longer bookable');
                    if (listing.hostId === userId) {
                        throw new ConflictException({ code: 'SELF_BOOKING_NOT_ALLOWED', message: 'You cannot book your own listing' });
                    }
                    const nights = Math.max(1, Math.ceil((endsAt.getTime() - startsAt.getTime()) / 86_400_000));
                    price = this.pricing.calculate({
                        basePriceMinor: listing.basePriceMinor,
                        units: nights,
                        guests: draft.guests,
                        currency: listing.currency,
                        cleaningFeeMinor: listing.cleaningFeeMinor,
                        serviceFeeMinor: listing.serviceFeeMinor,
                        taxMinor: listing.taxMinor,
                        extraGuestFeeMinor: listing.extraGuestFeeMinor,
                        depositMinor: listing.depositMinor,
                    });
                    providerId = listing.hostId;
                    title = listing.title;
                    await this.reserveListingInventory(tx, listing.id, startsAt, endsAt, listing.defaultTotalUnits);
                }
                else if (draft.guideId) {
                    if (draft.guideId === userId) {
                        throw new ConflictException({ code: 'SELF_BOOKING_NOT_ALLOWED', message: 'You cannot book yourself as a guide' });
                    }
                    const guide = await tx.guideProfile.findFirst({
                        where: { userId: draft.guideId, status: GuideStatus.APPROVED, verified: true, deletedAt: null },
                        include: { user: { select: { name: true } } },
                    });
                    if (!guide?.price)
                        throw new NotFoundException('Guide is no longer bookable');
                    const hours = Math.max(1, Math.ceil((endsAt.getTime() - startsAt.getTime()) / 3_600_000));
                    price = this.pricing.calculate({
                        basePriceMinor: this.pricing.decimalToMinor(guide.price),
                        units: hours,
                        guests: draft.guests,
                        currency: 'USD',
                    });
                    providerId = guide.userId;
                    title = `Guide: ${guide.user.name}`;
                    const overlap = await tx.booking.findFirst({
                        where: {
                            id: { not: draft.id },
                            deletedAt: null,
                            status: { in: ACTIVE_STATUSES },
                            startsAt: { lt: endsAt },
                            endsAt: { gt: startsAt },
                            guideId: draft.guideId,
                        },
                        select: { id: true },
                    });
                    if (overlap)
                        this.unavailable();
                }
                else {
                    throw new BadRequestException('Booking draft has no provider');
                }
                const changed = await tx.booking.updateMany({
                    where: { id: draft.id, travelerId: userId, status: BookingStatus.DRAFT, deletedAt: null },
                    data: {
                        status: BookingStatus.PENDING,
                        amount: this.pricing.minorToDecimal(price.amountMinor),
                        amountMinor: price.amountMinor,
                        baseAmountMinor: price.baseAmountMinor,
                        cleaningFeeMinor: price.cleaningFeeMinor,
                        serviceFeeMinor: price.serviceFeeMinor,
                        taxMinor: price.taxMinor,
                        extraGuestFeeMinor: price.extraGuestFeeMinor,
                        depositMinor: price.depositMinor,
                        currency: price.currency,
                        expiresAt: new Date(Math.min(startsAt.getTime(), Date.now() + 24 * 60 * 60_000)),
                        cancellationPolicy: CancellationPolicyType.FLEXIBLE,
                        freeCancellationUntil: new Date(startsAt.getTime() - 24 * 60 * 60_000),
                        lateCancellationPercent: 20,
                        noShowPercent: 100,
                    },
                });
                if (changed.count !== 1) {
                    throw new ConflictException({
                        code: 'BOOKING_DRAFT_ALREADY_SUBMITTED',
                        message: 'Booking draft changed; refresh before submitting again',
                    });
                }
                await tx.bookingEvent.create({
                    data: {
                        bookingId: draft.id,
                        actorId: userId,
                        actorType: BookingActorType.TRAVELER,
                        fromStatus: BookingStatus.DRAFT,
                        toStatus: BookingStatus.PENDING,
                        eventType: 'DRAFT_SUBMITTED',
                    },
                });
                await tx.conversation.create({
                    data: {
                        bookingId: draft.id,
                        title,
                        participants: { create: [{ userId }, { userId: providerId }] },
                        messages: {
                            create: { senderId: userId, type: MessageType.SYSTEM, body: 'Booking request sent' },
                        },
                    },
                });
                await tx.notification.create({
                    data: {
                        userId: providerId,
                        type: NotificationType.BOOKING_CREATED,
                        title: 'New booking request',
                        body: `${title} received a new booking request`,
                        data: { bookingId: draft.id },
                    },
                });
                return tx.booking.findUnique({ where: { id: draft.id }, include: includeBooking });
            }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
        }
        catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException)
                throw error;
            const message = error instanceof Error ? error.message : '';
            if (message.includes('no_overlap') || message.includes('exclusion') || message.includes('Transaction failed')) {
                this.unavailable();
            }
            throw error;
        }
    }
    async updateDraft(userId, bookingId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const draft = await tx.booking.findFirst({
                where: { id: bookingId, travelerId: userId, status: BookingStatus.DRAFT, deletedAt: null },
            });
            if (!draft)
                throw new NotFoundException('Booking draft not found');
            let listingId = dto.listingId === undefined ? draft.listingId ?? undefined : dto.listingId;
            let guideId = dto.guideId === undefined ? draft.guideId ?? undefined : dto.guideId;
            if (dto.listingId !== undefined && dto.guideId === undefined)
                guideId = undefined;
            if (dto.guideId !== undefined && dto.listingId === undefined)
                listingId = undefined;
            const merged = {
                listingId,
                guideId,
                startsAt: dto.startsAt ?? draft.startsAt.toISOString(),
                endsAt: dto.endsAt ?? draft.endsAt.toISOString(),
                guests: dto.guests ?? draft.guests,
                note: dto.note === undefined ? draft.note ?? undefined : dto.note,
            };
            this.assertProviderSelection(merged);
            const { startsAt, endsAt } = this.parseFutureDates(merged.startsAt, merged.endsAt);
            const price = await this.priceDraft(tx, userId, merged, startsAt, endsAt);
            const expectedUpdatedAt = dto.expectedUpdatedAt ? new Date(dto.expectedUpdatedAt) : draft.updatedAt;
            const changed = await tx.booking.updateMany({
                where: {
                    id: draft.id,
                    travelerId: userId,
                    status: BookingStatus.DRAFT,
                    deletedAt: null,
                    updatedAt: expectedUpdatedAt,
                },
                data: {
                    listingId: merged.listingId ?? null,
                    guideId: merged.guideId ?? null,
                    startsAt,
                    endsAt,
                    guests: merged.guests,
                    note: merged.note?.trim() || null,
                    amount: this.pricing.minorToDecimal(price.amountMinor),
                    amountMinor: price.amountMinor,
                    baseAmountMinor: price.baseAmountMinor,
                    cleaningFeeMinor: price.cleaningFeeMinor,
                    serviceFeeMinor: price.serviceFeeMinor,
                    taxMinor: price.taxMinor,
                    extraGuestFeeMinor: price.extraGuestFeeMinor,
                    depositMinor: price.depositMinor,
                    currency: price.currency,
                },
            });
            if (changed.count !== 1) {
                throw new ConflictException({
                    code: 'BOOKING_DRAFT_CHANGED',
                    message: 'Booking draft changed; refresh before saving again',
                });
            }
            return tx.booking.findUnique({ where: { id: draft.id }, include: includeBooking });
        }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
    }
    async deleteDraft(userId, bookingId) {
        const changed = await this.prisma.booking.updateMany({
            where: { id: bookingId, travelerId: userId, status: BookingStatus.DRAFT, deletedAt: null },
            data: { deletedAt: new Date() },
        });
        if (changed.count !== 1)
            throw new NotFoundException('Booking draft not found');
    }
    async updateStatus(userId, bookingId, action) {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findFirst({
                where: { id: bookingId, deletedAt: null },
                include: { listing: { select: { hostId: true } } },
            });
            if (!booking)
                throw new NotFoundException('Booking not found');
            const isTraveler = booking.travelerId === userId;
            const isProvider = booking.guideId === userId || booking.listing?.hostId === userId;
            const transition = this.resolveTransition(booking, action, isTraveler, isProvider);
            const cancellationFeeMinor = transition.to === BookingStatus.CANCELLED_BY_TRAVELER &&
                booking.status === BookingStatus.CONFIRMED &&
                booking.freeCancellationUntil &&
                booking.freeCancellationUntil <= new Date()
                ? this.pricing.percentage(booking.amountMinor, booking.lateCancellationPercent)
                : 0;
            const changed = await tx.booking.updateMany({
                where: { id: bookingId, status: booking.status },
                data: {
                    status: transition.to,
                    cancelledAt: transition.to === BookingStatus.CANCELLED_BY_TRAVELER || transition.to === BookingStatus.CANCELLED_BY_PROVIDER ? new Date() : undefined,
                    cancellationFeeMinor,
                    cancellationFee: this.pricing.minorToDecimal(cancellationFeeMinor),
                },
            });
            if (changed.count !== 1)
                throw new ConflictException({ code: 'BOOKING_TRANSITION_INVALID', message: 'Booking status changed; refresh and retry' });
            if (booking.listingId && (transition.to === BookingStatus.DECLINED ||
                transition.to === BookingStatus.CANCELLED_BY_TRAVELER ||
                transition.to === BookingStatus.CANCELLED_BY_PROVIDER)) {
                await this.releaseListingInventory(tx, booking.listingId, booking.startsAt, booking.endsAt);
            }
            await tx.bookingEvent.create({
                data: {
                    bookingId,
                    actorId: userId,
                    actorType: isProvider ? BookingActorType.PROVIDER : BookingActorType.TRAVELER,
                    fromStatus: booking.status,
                    toStatus: transition.to,
                    eventType: action,
                },
            });
            const conversation = await tx.conversation.findUnique({ where: { bookingId }, select: { id: true } });
            if (conversation) {
                await tx.message.create({
                    data: { conversationId: conversation.id, senderId: userId, type: MessageType.SYSTEM, body: transition.message },
                });
            }
            const recipientId = isProvider
                ? booking.travelerId
                : booking.guideId ?? booking.listing?.hostId;
            if (recipientId) {
                const notification = this.notificationForTransition(transition.to);
                await tx.notification.create({
                    data: {
                        userId: recipientId,
                        type: notification.type,
                        title: notification.title,
                        body: transition.message,
                        data: { bookingId },
                    },
                });
            }
            return tx.booking.findUnique({ where: { id: bookingId }, include: includeBooking });
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    }
    resolveTransition(booking, action, isTraveler, isProvider) {
        if (!isTraveler && !isProvider)
            throw new ForbiddenException();
        const invalid = () => { throw new ConflictException({ code: 'BOOKING_TRANSITION_INVALID', message: `Cannot ${action.toLowerCase()} a ${booking.status.toLowerCase()} booking` }); };
        switch (action) {
            case BookingAction.ACCEPT:
                if (!isProvider || booking.status !== BookingStatus.PENDING)
                    return invalid();
                return { to: BookingStatus.CONFIRMED, message: 'Provider accepted the booking' };
            case BookingAction.DECLINE:
                if (!isProvider || booking.status !== BookingStatus.PENDING)
                    return invalid();
                return { to: BookingStatus.DECLINED, message: 'Provider declined the booking' };
            case BookingAction.CANCEL:
                if (isTraveler && (booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED)) {
                    return { to: BookingStatus.CANCELLED_BY_TRAVELER, message: 'Booking was cancelled by traveler' };
                }
                if (isProvider && booking.status === BookingStatus.CONFIRMED) {
                    return { to: BookingStatus.CANCELLED_BY_PROVIDER, message: 'Booking was cancelled by provider' };
                }
                return invalid();
            case BookingAction.START:
                if (!isProvider || booking.status !== BookingStatus.CONFIRMED)
                    return invalid();
                return { to: BookingStatus.IN_PROGRESS, message: 'Booking started' };
            case BookingAction.COMPLETE:
                if (!isProvider || booking.status !== BookingStatus.IN_PROGRESS)
                    return invalid();
                return { to: BookingStatus.COMPLETED, message: 'Booking completed' };
            case BookingAction.DISPUTE:
                if (booking.status !== BookingStatus.IN_PROGRESS && booking.status !== BookingStatus.COMPLETED)
                    return invalid();
                return { to: BookingStatus.DISPUTED, message: 'A booking dispute was opened' };
        }
    }
    replay(storedHash, requestHash, responseBody) {
        if (storedHash !== requestHash) {
            throw new ConflictException({ code: 'IDEMPOTENCY_KEY_REUSED', message: 'Idempotency key was already used with a different payload' });
        }
        if (!responseBody)
            throw new ConflictException({ code: 'IDEMPOTENCY_REQUEST_IN_PROGRESS', message: 'The original request is still processing' });
        return responseBody;
    }
    assertProviderSelection(dto) {
        if (Boolean(dto.listingId) === Boolean(dto.guideId)) {
            throw new BadRequestException('Choose exactly one listing or guide');
        }
    }
    parseFutureDates(startsAtValue, endsAtValue) {
        const startsAt = new Date(startsAtValue);
        const endsAt = new Date(endsAtValue);
        if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
            throw new BadRequestException('Booking dates are invalid');
        }
        if (endsAt <= startsAt)
            throw new BadRequestException('End time must be after start time');
        if (startsAt <= new Date())
            throw new BadRequestException('Booking start time must be in the future');
        return { startsAt, endsAt };
    }
    async priceDraft(tx, userId, dto, startsAt, endsAt) {
        if (dto.listingId) {
            const listing = await tx.listing.findFirst({
                where: { id: dto.listingId, published: true, deletedAt: null },
            });
            if (!listing)
                throw new NotFoundException('Listing not found');
            if (listing.hostId === userId) {
                throw new ConflictException({ code: 'SELF_BOOKING_NOT_ALLOWED', message: 'You cannot book your own listing' });
            }
            const nights = Math.max(1, Math.ceil((endsAt.getTime() - startsAt.getTime()) / 86_400_000));
            return this.pricing.calculate({
                basePriceMinor: listing.basePriceMinor,
                units: nights,
                guests: dto.guests,
                currency: listing.currency,
                cleaningFeeMinor: listing.cleaningFeeMinor,
                serviceFeeMinor: listing.serviceFeeMinor,
                taxMinor: listing.taxMinor,
                extraGuestFeeMinor: listing.extraGuestFeeMinor,
                depositMinor: listing.depositMinor,
            });
        }
        if (dto.guideId === userId) {
            throw new ConflictException({ code: 'SELF_BOOKING_NOT_ALLOWED', message: 'You cannot book yourself as a guide' });
        }
        const guide = await tx.guideProfile.findFirst({
            where: { userId: dto.guideId, status: GuideStatus.APPROVED, verified: true, deletedAt: null },
        });
        if (!guide?.price)
            throw new NotFoundException('Bookable guide not found');
        const hours = Math.max(1, Math.ceil((endsAt.getTime() - startsAt.getTime()) / 3_600_000));
        return this.pricing.calculate({
            basePriceMinor: this.pricing.decimalToMinor(guide.price),
            units: hours,
            guests: dto.guests,
            currency: 'USD',
        });
    }
    unavailable() {
        throw new ConflictException({ code: 'BOOKING_TIME_UNAVAILABLE', message: 'Selected time is no longer available' });
    }
    notificationForTransition(status) {
        switch (status) {
            case BookingStatus.CONFIRMED:
                return { type: NotificationType.BOOKING_ACCEPTED, title: 'Booking accepted' };
            case BookingStatus.DECLINED:
                return { type: NotificationType.BOOKING_DECLINED, title: 'Booking declined' };
            case BookingStatus.IN_PROGRESS:
                return { type: NotificationType.BOOKING_STARTED, title: 'Booking started' };
            case BookingStatus.COMPLETED:
                return { type: NotificationType.BOOKING_COMPLETED, title: 'Booking completed' };
            default:
                return { type: NotificationType.BOOKING_CANCELLED, title: 'Booking cancelled' };
        }
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
    async reserveListingInventory(tx, listingId, startsAt, endsAt, defaultTotalUnits) {
        for (const date of this.inventoryDates(startsAt, endsAt)) {
            await tx.$executeRaw `
        INSERT INTO "ListingInventory" ("id", "listingId", "date", "totalUnits", "reservedUnits", "availableUnits", "createdAt", "updatedAt")
        VALUES (${randomUUID()}::uuid, ${listingId}::uuid, ${date}, ${defaultTotalUnits}, 0, ${defaultTotalUnits}, NOW(), NOW())
        ON CONFLICT ("listingId", "date") DO NOTHING
      `;
            const reserved = await tx.listingInventory.updateMany({
                where: { listingId, date, availableUnits: { gt: 0 } },
                data: { reservedUnits: { increment: 1 }, availableUnits: { decrement: 1 } },
            });
            if (reserved.count !== 1)
                this.unavailable();
        }
    }
    async releaseListingInventory(tx, listingId, startsAt, endsAt) {
        for (const date of this.inventoryDates(startsAt, endsAt)) {
            await tx.listingInventory.updateMany({
                where: { listingId, date, reservedUnits: { gt: 0 } },
                data: { reservedUnits: { decrement: 1 }, availableUnits: { increment: 1 } },
            });
        }
    }
};
BookingsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        PricingService])
], BookingsService);
export { BookingsService };
//# sourceMappingURL=bookings.service.js.map