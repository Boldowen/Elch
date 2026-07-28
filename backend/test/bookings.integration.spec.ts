import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { BookingsService } from '../src/modules/bookings/bookings.service.js';
import { BookingLifecycleService } from '../src/modules/bookings/booking-lifecycle.service.js';
import { BookingAction } from '../src/modules/bookings/dto/update-booking-status.dto.js';
import { ListingsService } from '../src/modules/listings/listings.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { GuideStatus, ListingCategory, PriceUnit, PricingType, Role } from '../src/generated/prisma/client.js';

const databaseUrl = process.env.DATABASE_URL ?? '';
if (process.env.NODE_ENV !== 'test' || !databaseUrl.includes('ventour_test')) {
  throw new Error('Integration tests require NODE_ENV=test and an isolated ventour_test database');
}

describe('booking reliability', () => {
  const prisma = new PrismaService(new ConfigService({ DATABASE_URL: databaseUrl }));
  const service = new BookingsService(prisma);
  const lifecycle = new BookingLifecycleService(prisma);
  const listings = new ListingsService(prisma);
  let travelerId: string;
  let hostId: string;
  let listingId: string;

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.idempotencyKey.deleteMany();
    await prisma.bookingEvent.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.listingImage.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.guideProfile.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();

    const traveler = await prisma.user.create({
      data: { email: 'traveler@test.ventour.mn', name: 'Test Traveler', roles: [Role.TRAVELER] },
    });
    const host = await prisma.user.create({
      data: { email: 'host@test.ventour.mn', name: 'Test Host', roles: [Role.GUIDE] },
    });
    travelerId = traveler.id;
    hostId = host.id;
    await prisma.guideProfile.create({
      data: {
        userId: hostId,
        country: 'Mongolia',
        city: 'Ulaanbaatar',
        bio: 'Integration test guide',
        languages: ['mn'],
        expertise: ['city'],
        availability: [],
        pricingType: PricingType.HOURLY,
        price: '20.00',
        status: GuideStatus.APPROVED,
        verified: true,
      },
    });
    const listing = await prisma.listing.create({
      data: {
        slug: 'integration-test-listing',
        title: 'Integration Test Listing',
        location: 'Ulaanbaatar',
        description: 'Only used in the isolated integration database',
        category: ListingCategory.HOTEL,
        price: '50.00',
        priceUnit: PriceUnit.PER_NIGHT,
        datesLabel: 'Test',
        tags: [],
        amenities: [],
        hostId,
      },
    });
    listingId = listing.id;
  });

  afterAll(async () => prisma.$disconnect());

  const interval = (offsetDays = 0) => {
    const startsAt = new Date(Date.now() + (10 + offsetDays) * 86_400_000);
    const endsAt = new Date(startsAt.getTime() + 3_600_000);
    return { startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString(), guests: 1 };
  };

  it('rejects listing and guide self-booking', async () => {
    await expect(service.create(hostId, { listingId, ...interval(1) }, randomUUID()))
      .rejects.toMatchObject({ response: { code: 'SELF_BOOKING_NOT_ALLOWED' } });
    await expect(service.create(hostId, { guideId: hostId, ...interval(2) }, randomUUID()))
      .rejects.toMatchObject({ response: { code: 'SELF_BOOKING_NOT_ALLOWED' } });
  });

  it('replays one response for the same idempotency key and rejects changed payload', async () => {
    const key = randomUUID();
    const payload = { listingId, ...interval(3) };
    const first = await service.create(travelerId, payload, key);
    const replay = await service.create(travelerId, payload, key);
    expect(replay).toMatchObject({ id: (first as { id: string }).id });
    await expect(service.create(travelerId, { ...payload, guests: 2 }, key))
      .rejects.toBeInstanceOf(ConflictException);
    expect(await prisma.booking.count({ where: { listingId, startsAt: new Date(payload.startsAt) } })).toBe(1);
  });

  it('allows only one of ten concurrent overlapping guide requests', async () => {
    const travelers = await Promise.all(Array.from({ length: 10 }, (_, index) =>
      prisma.user.create({
        data: { email: `concurrent-${index}@test.ventour.mn`, name: `Traveler ${index}`, roles: [Role.TRAVELER] },
      }),
    ));
    const payload = { guideId: hostId, ...interval(4) };
    const results = await Promise.allSettled(
      travelers.map((traveler) => service.create(traveler.id, payload, randomUUID())),
    );
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(9);
    expect(await prisma.booking.count({ where: { guideId: hostId, startsAt: new Date(payload.startsAt) } })).toBe(1);
  });

  it('snapshots cancellation terms and calculates a late traveler fee', async () => {
    const startsAt = new Date(Date.now() + 12 * 3_600_000);
    const payload = {
      listingId,
      startsAt: startsAt.toISOString(),
      endsAt: new Date(startsAt.getTime() + 3_600_000).toISOString(),
      guests: 1,
    };
    const created = await service.create(travelerId, payload, randomUUID()) as { id: string };
    await service.updateStatus(hostId, created.id, BookingAction.ACCEPT);
    const cancelled = await service.updateStatus(travelerId, created.id, BookingAction.CANCEL);
    expect(cancelled).toMatchObject({
      status: 'CANCELLED_BY_TRAVELER',
      lateCancellationPercent: 20,
    });
    expect(Number(cancelled?.cancellationFee)).toBe(10);
  });

  it('expires, starts, and completes bookings through the system lifecycle', async () => {
    const now = new Date();
    const expired = await prisma.booking.create({
      data: {
        travelerId,
        listingId,
        startsAt: new Date(now.getTime() + 30 * 86_400_000),
        endsAt: new Date(now.getTime() + 31 * 86_400_000),
        amount: '50.00',
        expiresAt: new Date(now.getTime() - 1_000),
      },
    });
    const running = await prisma.booking.create({
      data: {
        travelerId,
        guideId: hostId,
        startsAt: new Date(now.getTime() - 3_600_000),
        endsAt: new Date(now.getTime() + 3_600_000),
        amount: '20.00',
        status: 'CONFIRMED',
      },
    });

    await lifecycle.runOnce(now);
    expect(await prisma.booking.findUnique({ where: { id: expired.id } })).toMatchObject({ status: 'EXPIRED' });
    expect(await prisma.booking.findUnique({ where: { id: running.id } })).toMatchObject({ status: 'IN_PROGRESS' });

    await prisma.booking.update({ where: { id: running.id }, data: { endsAt: new Date(now.getTime() - 1_000) } });
    await lifecycle.runOnce(now);
    expect(await prisma.booking.findUnique({ where: { id: running.id } })).toMatchObject({ status: 'COMPLETED' });
    expect(await prisma.guideProfile.findUnique({ where: { userId: hostId } })).toMatchObject({ completedTrips: 1 });
  });

  it('supports owned listing draft, publish, update, and unpublish workflow', async () => {
    const draft = await listings.create(hostId, {
      title: 'Managed Test Camp',
      location: 'Ulaanbaatar',
      description: 'A sufficiently detailed description for listing management tests.',
      category: ListingCategory.HOTEL,
      price: 75,
      priceUnit: PriceUnit.PER_NIGHT,
      datesLabel: 'Flexible dates',
      tags: ['test'],
      amenities: ['wifi'],
      defaultTotalUnits: 2,
      images: [],
    });
    expect(draft).toMatchObject({ status: 'DRAFT', published: false });
    expect(await listings.publish(hostId, draft.id)).toMatchObject({ status: 'PUBLISHED', published: true });
    expect(await listings.update(hostId, draft.id, { price: 80 })).toMatchObject({ price: expect.anything() });
    expect(await listings.unpublish(hostId, draft.id)).toMatchObject({ status: 'DRAFT', published: false });
  });

  it('atomically enforces multi-unit listing inventory and releases cancellation stock', async () => {
    const startsAt = new Date(Date.now() + 20 * 86_400_000);
    const endsAt = new Date(startsAt.getTime() + 3_600_000);
    const date = startsAt.toISOString().slice(0, 10);
    await listings.setInventory(hostId, listingId, { days: [{ date, totalUnits: 2 }] });
    const travelers = await Promise.all(Array.from({ length: 5 }, (_, index) =>
      prisma.user.create({ data: { email: `inventory-${index}@test.ventour.mn`, name: `Inventory ${index}`, roles: [Role.TRAVELER] } }),
    ));
    const results = await Promise.allSettled(travelers.map((traveler) => service.create(traveler.id, {
      listingId,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      guests: 1,
    }, randomUUID())));
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(2);
    const inventory = await prisma.listingInventory.findUnique({ where: { listingId_date: { listingId, date: new Date(`${date}T00:00:00.000Z`) } } });
    expect(inventory).toMatchObject({ totalUnits: 2, reservedUnits: 2, availableUnits: 0 });

    const winnerIndex = results.findIndex((result) => result.status === 'fulfilled');
    const booking = results[winnerIndex] as PromiseFulfilledResult<{ id: string }>;
    await service.updateStatus(travelers[winnerIndex].id, booking.value.id, BookingAction.CANCEL);
    expect(await prisma.listingInventory.findUnique({ where: { listingId_date: { listingId, date: new Date(`${date}T00:00:00.000Z`) } } }))
      .toMatchObject({ reservedUnits: 1, availableUnits: 1 });
  });
});
