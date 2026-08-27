import { ServiceUnavailableException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { ToolRegistryService } from '../src/modules/ai/tools/tool-registry.service.js';
import { RoutePlanningService } from '../src/modules/route-planning/route-planning.service.js';

describe('controlled AI tools', () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const listingId = '22222222-2222-4222-8222-222222222222';
  const draftId = '33333333-3333-4333-8333-333333333333';
  const idempotencyKey = '44444444-4444-4444-8444-444444444444';
  const startsAt = '2099-07-01T08:00:00.000Z';
  const endsAt = '2099-07-02T08:00:00.000Z';
  const prisma = {
    listing: { findMany: async () => [], findFirst: async () => null },
    guideProfile: { findMany: async () => [], findFirst: async () => null },
  };
  const createDraft = jest.fn();
  const bookings = {
    createDraft,
    create: jest.fn(),
    submitDraft: jest.fn(),
  };
  const tools = new ToolRegistryService(
    prisma as never,
    new RoutePlanningService(),
    bookings as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects unknown tools and cannot execute arbitrary SQL', async () => {
    await expect(tools.execute('queryDatabase', { sql: 'DROP TABLE User' }, { userId: 'u', roles: [] })).rejects.toMatchObject({ status: 400 });
  });

  it('validates result limits', async () => {
    await expect(tools.execute('searchRoutes', { limit: 1000 }, { userId: 'u', roles: [] })).rejects.toMatchObject({ status: 400 });
  });

  it('validates route tool parameters before execution', async () => {
    await expect(tools.execute('validateRoute', { routeId: 'gobi', startDate: 'not-a-date', stops: [] }, { userId: 'u', roles: [] })).rejects.toMatchObject({ status: 400 });
  });

  it('returns only controlled route data', async () => {
    const result = await tools.execute('searchRoutes', { query: 'Gobi', limit: 2 }, { userId: 'u', roles: [] });
    expect(result.tool).toBe('searchRoutes');
    expect(result.data).toEqual([expect.objectContaining({ id: 'gobi' })]);
  });

  it('creates only an inert owned draft and returns a private-field-safe projection', async () => {
    createDraft.mockResolvedValue({
      id: draftId,
      travelerId: userId,
      status: 'DRAFT',
      listingId,
      guideId: null,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      guests: 2,
      amountMinor: 12_500,
      currency: 'USD',
      note: 'private traveler note',
      listing: { hostId: 'private-provider-id' },
      payment: { instructions: 'private payment instructions' },
    });

    const result = await tools.execute('createBookingDraft', {
      listingId,
      startsAt,
      endsAt,
      guests: 2,
      note: 'Please hold this option',
      idempotencyKey,
    }, { userId, roles: ['TRAVELER'] });

    expect(createDraft).toHaveBeenCalledWith(userId, {
      listingId,
      guideId: undefined,
      startsAt,
      endsAt,
      guests: 2,
      note: 'Please hold this option',
    }, idempotencyKey);
    expect(bookings.create).not.toHaveBeenCalled();
    expect(bookings.submitDraft).not.toHaveBeenCalled();
    expect(result).toEqual({
      tool: 'createBookingDraft',
      truncated: false,
      data: {
        id: draftId,
        status: 'DRAFT',
        listingId,
        guideId: null,
        startsAt,
        endsAt,
        guests: 2,
        amountMinor: 12_500,
        currency: 'USD',
        nextAction: 'USER_CONFIRMATION_REQUIRED',
        requiresExplicitConfirmation: true,
      },
    });
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('private traveler note');
    expect(serialized).not.toContain('private-provider-id');
    expect(serialized).not.toContain('private payment instructions');
    expect(serialized).not.toContain(userId);
  });

  it('requires authenticated user context before creating a draft', async () => {
    await expect(tools.execute('createBookingDraft', {
      listingId,
      startsAt,
      endsAt,
      idempotencyKey,
    }, undefined as never)).rejects.toMatchObject({ status: 401 });
    await expect(tools.execute(
      'createBookingDraft',
      null,
      undefined as never,
    )).rejects.toMatchObject({ status: 401 });
    expect(createDraft).not.toHaveBeenCalled();
  });

  it('strictly rejects unknown, privileged, ambiguous, or malformed parameters', async () => {
    const base = { listingId, startsAt, endsAt, idempotencyKey };
    const invalid = [
      { ...base, travelerId: userId },
      { ...base, status: 'PENDING' },
      { ...base, guideId: '55555555-5555-4555-8555-555555555555' },
      { ...base, guests: '2' },
      { ...base, guests: null },
      { ...base, idempotencyKey: 'not-a-uuid' },
      { ...base, endsAt: startsAt },
    ];

    for (const params of invalid) {
      await expect(tools.execute(
        'createBookingDraft',
        params,
        { userId, roles: ['TRAVELER'] },
      )).rejects.toMatchObject({ status: 400 });
    }
    expect(createDraft).not.toHaveBeenCalled();
  });

  it('never exposes internal booking errors or accepts a non-draft result', async () => {
    createDraft.mockRejectedValueOnce(new Error('postgres password and private row data'));
    const request = { listingId, startsAt, endsAt, idempotencyKey };

    let failure: unknown;
    try {
      await tools.execute(
        'createBookingDraft',
        request,
        { userId, roles: ['TRAVELER'] },
      );
    } catch (error) {
      failure = error;
    }
    expect(failure).toBeInstanceOf(ServiceUnavailableException);
    expect(JSON.stringify(
      (failure as ServiceUnavailableException).getResponse(),
    )).toBe(JSON.stringify({
      code: 'BOOKING_DRAFT_UNAVAILABLE',
      message: 'The booking draft could not be created',
    }));

    createDraft.mockResolvedValueOnce({
      id: draftId,
      status: 'PENDING',
      amountMinor: 100,
      currency: 'USD',
    });
    await expect(tools.execute(
      'createBookingDraft',
      request,
      { userId, roles: ['TRAVELER'] },
    )).rejects.toMatchObject({ status: 503 });
  });
});
