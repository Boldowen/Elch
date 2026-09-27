import { jest } from '@jest/globals';
import { GuideAvailabilityStatus } from '../src/generated/prisma/client.js';
import { GuideAvailabilityService, guideWindowAvailable } from '../src/modules/guides/guide-availability.service.js';

const at = (hour: number) => new Date(Date.UTC(2026, 9, 1, hour));
const slot = (start: number, end: number, status: GuideAvailabilityStatus) => ({ startsAt: at(start), endsAt: at(end), status });

describe('guideWindowAvailable', () => {
  it('treats an unconfigured calendar as open', () => {
    expect(guideWindowAvailable([], at(9), at(12))).toBe(true);
  });

  it('requires the request to fit inside one AVAILABLE window', () => {
    const slots = [slot(8, 12, GuideAvailabilityStatus.AVAILABLE), slot(13, 18, GuideAvailabilityStatus.AVAILABLE)];
    expect(guideWindowAvailable(slots, at(8), at(12))).toBe(true);
    expect(guideWindowAvailable(slots, at(11), at(14))).toBe(false);
    expect(guideWindowAvailable(slots, at(19), at(20))).toBe(false);
  });

  it('lets a BLOCKED window override an AVAILABLE one, but not at a touching edge', () => {
    const slots = [slot(8, 18, GuideAvailabilityStatus.AVAILABLE), slot(12, 13, GuideAvailabilityStatus.BLOCKED)];
    expect(guideWindowAvailable(slots, at(11), at(14))).toBe(false);
    expect(guideWindowAvailable(slots, at(9), at(12))).toBe(true);
    expect(guideWindowAvailable(slots, at(13), at(15))).toBe(true);
  });

  it('blocks time even when no AVAILABLE windows are configured', () => {
    expect(guideWindowAvailable([slot(9, 10, GuideAvailabilityStatus.BLOCKED)], at(8), at(11))).toBe(false);
  });
});

describe('GuideAvailabilityService.replace', () => {
  const dto = (startsAt: string, endsAt: string, timeZone = 'Asia/Ulaanbaatar') => ({
    slots: [{ startsAt, endsAt, timeZone, status: GuideAvailabilityStatus.AVAILABLE }],
  });

  it('rejects inverted intervals and unknown time zones before touching the database', async () => {
    const $transaction = jest.fn();
    const service = new GuideAvailabilityService({ $transaction } as never);
    await expect(service.replace('g', dto('2026-10-01T12:00:00Z', '2026-10-01T09:00:00Z'))).rejects.toThrow('after start');
    await expect(service.replace('g', dto('2026-10-01T09:00:00Z', '2026-10-01T12:00:00Z', 'Mars/Olympus'))).rejects.toThrow('time zone');
    expect($transaction).not.toHaveBeenCalled();
  });

  it('refuses a schedule that no longer covers an active booking', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'profile' }] as never),
      booking: { findMany: jest.fn().mockResolvedValue([{ startsAt: new Date('2026-10-01T14:00:00Z'), endsAt: new Date('2026-10-01T16:00:00Z') }] as never) },
      guideAvailability: { deleteMany: jest.fn(), createMany: jest.fn() },
    };
    const service = new GuideAvailabilityService({ $transaction: (fn: (t: typeof tx) => unknown) => fn(tx) } as never);
    await expect(service.replace('g', dto('2026-10-01T09:00:00Z', '2026-10-01T12:00:00Z'))).rejects.toMatchObject({
      response: { code: 'AVAILABILITY_HAS_BOOKINGS' },
    });
    expect(tx.guideAvailability.deleteMany).not.toHaveBeenCalled();
  });
});
