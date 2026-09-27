import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, GuideAvailabilityStatus, GuideStatus, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SetGuideAvailabilityDto } from './dto/guide-availability.dto.js';

type AvailabilityWindow = { startsAt: Date; endsAt: Date; status: GuideAvailabilityStatus };
const activeStatuses = [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS];

export function guideWindowAvailable(slots: AvailabilityWindow[], startsAt: Date, endsAt: Date) {
  if (slots.some((slot) => slot.status === GuideAvailabilityStatus.BLOCKED && slot.startsAt < endsAt && slot.endsAt > startsAt)) return false;
  const available = slots.filter((slot) => slot.status === GuideAvailabilityStatus.AVAILABLE);
  return available.length === 0 || available.some((slot) => slot.startsAt <= startsAt && slot.endsAt >= endsAt);
}

// Calendar edits and booking writes take the same provider lock, so a booking
// cannot be committed against a schedule that changed after validation.
export async function assertGuideTimeAvailable(tx: Prisma.TransactionClient, guideId: string, startsAt: Date, endsAt: Date) {
  await tx.$queryRaw`SELECT "id" FROM "GuideProfile" WHERE "userId" = ${guideId}::uuid FOR UPDATE`;
  const slots = await tx.guideAvailability.findMany({ where: { guideId } });
  if (!guideWindowAvailable(slots, startsAt, endsAt)) {
    throw new ConflictException({ code: 'BOOKING_TIME_UNAVAILABLE', message: 'Selected time is no longer available' });
  }
}

@Injectable()
export class GuideAvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async list(guideId: string, owned = false, from?: string, to?: string) {
    const guide = await this.prisma.guideProfile.findFirst({
      where: { userId: guideId, deletedAt: null, ...(owned ? {} : { status: GuideStatus.APPROVED, verified: true }) },
      select: { userId: true },
    });
    if (!guide) throw new NotFoundException('Guide not found');
    const startsAt = from ? this.date(from) : undefined;
    const endsAt = to ? this.date(to) : undefined;
    if (startsAt && endsAt && endsAt <= startsAt) throw new BadRequestException('End time must be after start time');
    const slots = await this.prisma.guideAvailability.findMany({ where: { guideId }, orderBy: { startsAt: 'asc' } });
    const busy = await this.prisma.booking.findMany({
      where: {
        guideId, deletedAt: null, status: { in: activeStatuses },
        ...(endsAt ? { startsAt: { lt: endsAt } } : {}),
        endsAt: { gt: startsAt ?? new Date() },
      },
      select: { startsAt: true, endsAt: true },
      orderBy: { startsAt: 'asc' },
      take: 200,
    });
    return {
      configured: slots.length > 0,
      slots: slots.filter((slot) => (!startsAt || slot.endsAt > startsAt) && (!endsAt || slot.startsAt < endsAt)),
      busy,
    };
  }

  async replace(guideId: string, dto: SetGuideAvailabilityDto) {
    const slots = dto.slots.map((slot) => {
      const startsAt = this.date(slot.startsAt);
      const endsAt = this.date(slot.endsAt);
      if (endsAt <= startsAt) throw new BadRequestException('Availability end time must be after start time');
      try { new Intl.DateTimeFormat('en', { timeZone: slot.timeZone }); }
      catch { throw new BadRequestException('A valid IANA time zone is required'); }
      return { ...slot, startsAt, endsAt };
    });
    await this.prisma.$transaction(async (tx) => {
      const guides = await tx.$queryRaw<{ id: string }[]>`
        SELECT "id" FROM "GuideProfile" WHERE "userId" = ${guideId}::uuid AND "deletedAt" IS NULL FOR UPDATE
      `;
      if (!guides.length) throw new NotFoundException('Guide profile not found');
      const bookings = await tx.booking.findMany({
        where: { guideId, deletedAt: null, status: { in: activeStatuses }, endsAt: { gt: new Date() } },
        select: { startsAt: true, endsAt: true },
      });
      if (bookings.some((booking) => !guideWindowAvailable(slots, booking.startsAt, booking.endsAt))) {
        throw new ConflictException({ code: 'AVAILABILITY_HAS_BOOKINGS', message: 'The schedule conflicts with an active booking' });
      }
      await tx.guideAvailability.deleteMany({ where: { guideId } });
      if (slots.length) await tx.guideAvailability.createMany({ data: slots.map((slot) => ({ ...slot, guideId })) });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
    return this.list(guideId, true);
  }

  private date(value: string) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) throw new BadRequestException('Invalid availability date');
    return date;
  }
}
