import { ConflictException, NotFoundException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { BookingStatus } from '../src/generated/prisma/client.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { BookingsService } from '../src/modules/bookings/bookings.service.js';
import { BookingAction } from '../src/modules/bookings/dto/update-booking-status.dto.js';
import { PricingService } from '../src/modules/pricing/pricing.service.js';

const travelerId = '11111111-1111-4111-8111-111111111111';
const providerId = '22222222-2222-4222-8222-222222222222';
const listingId = '33333333-3333-4333-8333-333333333333';
const bookingId = '44444444-4444-4444-8444-444444444444';
const idempotencyKey = '55555555-5555-4555-8555-555555555555';
const startsAt = new Date('2099-07-01T08:00:00.000Z');
const endsAt = new Date('2099-07-02T08:00:00.000Z');

const listing = {
  id: listingId,
  hostId: providerId,
  title: 'Unit Test Listing',
  basePriceMinor: 10_000,
  currency: 'USD',
  cleaningFeeMinor: 500,
  serviceFeeMinor: 250,
  taxMinor: 100,
  extraGuestFeeMinor: 0,
  depositMinor: 0,
  defaultTotalUnits: 1,
};

describe('BookingsService draft flow', () => {
  const pricing = new PricingService();

  it('creates an inert idempotent draft without provider-facing side effects', async () => {
    const createEvent = jest.fn();
    const createConversation = jest.fn();
    const createNotification = jest.fn();
    const reserveInventory = jest.fn();
    const tx = {
      idempotencyKey: {
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
      },
      listing: { findFirst: jest.fn().mockResolvedValue(listing) },
      guideProfile: { findFirst: jest.fn() },
      booking: {
        create: jest.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) =>
          Promise.resolve({ id: bookingId, ...data }),
        ),
      },
      bookingEvent: { create: createEvent },
      conversation: { create: createConversation },
      notification: { create: createNotification },
      listingInventory: { updateMany: reserveInventory },
    };
    const prisma = {
      idempotencyKey: { findUnique: jest.fn().mockResolvedValue(null) },
      $transaction: jest.fn((callback: (client: typeof tx) => Promise<unknown>) => callback(tx)),
    } as unknown as PrismaService;
    const service = new BookingsService(prisma, pricing);

    const result = await service.createDraft(travelerId, {
      listingId,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      guests: 1,
    }, idempotencyKey);

    expect(result).toMatchObject({ id: bookingId, status: BookingStatus.DRAFT, expiresAt: null });
    expect(tx.booking.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: BookingStatus.DRAFT }),
    }));
    expect(createEvent).not.toHaveBeenCalled();
    expect(createConversation).not.toHaveBeenCalled();
    expect(createNotification).not.toHaveBeenCalled();
    expect(reserveInventory).not.toHaveBeenCalled();
  });

  it('atomically activates an owned draft and creates side effects only on submission', async () => {
    const draft = {
      id: bookingId,
      travelerId,
      listingId,
      guideId: null,
      startsAt,
      endsAt,
      guests: 1,
      status: BookingStatus.DRAFT,
      deletedAt: null,
    };
    const tx = {
      booking: {
        findFirst: jest.fn().mockResolvedValue(draft),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUnique: jest.fn().mockResolvedValue({ ...draft, status: BookingStatus.PENDING }),
      },
      listing: { findFirst: jest.fn().mockResolvedValue(listing) },
      guideProfile: { findFirst: jest.fn() },
      listingInventory: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      $executeRaw: jest.fn().mockResolvedValue(1),
      bookingEvent: { create: jest.fn().mockResolvedValue({}) },
      conversation: { create: jest.fn().mockResolvedValue({}) },
      notification: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => Promise<unknown>) => callback(tx)),
    } as unknown as PrismaService;
    const service = new BookingsService(prisma, pricing);

    await expect(service.submitDraft(travelerId, bookingId)).resolves.toMatchObject({
      id: bookingId,
      status: BookingStatus.PENDING,
    });
    expect(tx.listingInventory.updateMany).toHaveBeenCalledTimes(1);
    expect(tx.booking.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ id: bookingId, travelerId, status: BookingStatus.DRAFT }),
      data: expect.objectContaining({ status: BookingStatus.PENDING }),
    }));
    expect(tx.bookingEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ fromStatus: BookingStatus.DRAFT, toStatus: BookingStatus.PENDING }),
    });
    expect(tx.conversation.create).toHaveBeenCalledTimes(1);
    expect(tx.notification.create).toHaveBeenCalledTimes(1);
  });

  it('rejects non-owners and prevents a provider from accepting a draft', async () => {
    const submitTx = {
      booking: { findFirst: jest.fn().mockResolvedValue(null) },
    };
    const submitPrisma = {
      $transaction: jest.fn((callback: (client: typeof submitTx) => Promise<unknown>) => callback(submitTx)),
    } as unknown as PrismaService;
    await expect(new BookingsService(submitPrisma, pricing).submitDraft(providerId, bookingId))
      .rejects.toBeInstanceOf(NotFoundException);

    const statusTx = {
      booking: {
        findFirst: jest.fn().mockResolvedValue({
          id: bookingId,
          travelerId,
          guideId: null,
          listingId,
          listing: { hostId: providerId },
          startsAt,
          endsAt,
          status: BookingStatus.DRAFT,
          freeCancellationUntil: null,
          amountMinor: 10_000,
          lateCancellationPercent: 0,
        }),
      },
    };
    const statusPrisma = {
      $transaction: jest.fn((callback: (client: typeof statusTx) => Promise<unknown>) => callback(statusTx)),
    } as unknown as PrismaService;
    await expect(new BookingsService(statusPrisma, pricing).updateStatus(providerId, bookingId, BookingAction.ACCEPT))
      .rejects.toBeInstanceOf(ConflictException);
  });

  it('reprices an owned draft update without reserving inventory or notifying providers', async () => {
    const updatedAt = new Date('2026-08-27T00:00:00.000Z');
    const draft = {
      id: bookingId,
      travelerId,
      listingId,
      guideId: null,
      startsAt,
      endsAt,
      guests: 1,
      note: null,
      status: BookingStatus.DRAFT,
      deletedAt: null,
      updatedAt,
    };
    const tx = {
      booking: {
        findFirst: jest.fn().mockResolvedValue(draft),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUnique: jest.fn().mockResolvedValue({ ...draft, guests: 2 }),
      },
      listing: { findFirst: jest.fn().mockResolvedValue(listing) },
      guideProfile: { findFirst: jest.fn() },
      listingInventory: { updateMany: jest.fn() },
      notification: { create: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => Promise<unknown>) => callback(tx)),
    } as unknown as PrismaService;
    const service = new BookingsService(prisma, pricing);

    await expect(service.updateDraft(travelerId, bookingId, { guests: 2, expectedUpdatedAt: updatedAt.toISOString() }))
      .resolves.toMatchObject({ guests: 2 });
    expect(tx.booking.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ travelerId, status: BookingStatus.DRAFT, updatedAt }),
      data: expect.objectContaining({ guests: 2, amountMinor: expect.any(Number) }),
    }));
    expect(tx.listingInventory.updateMany).not.toHaveBeenCalled();
    expect(tx.notification.create).not.toHaveBeenCalled();
  });
});
