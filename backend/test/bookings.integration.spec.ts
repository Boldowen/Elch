import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { BookingsService } from '../src/modules/bookings/bookings.service.js';
import { BookingLifecycleService } from '../src/modules/bookings/booking-lifecycle.service.js';
import { BookingAction } from '../src/modules/bookings/dto/update-booking-status.dto.js';
import { ListingsService } from '../src/modules/listings/listings.service.js';
import { NotificationsService } from '../src/modules/notifications/notifications.service.js';
import { PricingService } from '../src/modules/pricing/pricing.service.js';
import { AuthService } from '../src/auth/auth.service.js';
import { EmailDeliveryService } from '../src/auth/email-delivery.service.js';
import { JwtService } from '@nestjs/jwt';
import { GuidesService } from '../src/modules/guides/guides.service.js';
import { GuideReviewDecision } from '../src/modules/guides/dto/review-guide-application.dto.js';
import { TrustSafetyService } from '../src/modules/trust-safety/trust-safety.service.js';
import { ConversationsService } from '../src/modules/conversations/conversations.service.js';
import { SocialService } from '../src/modules/social/social.service.js';
import { ReviewsService } from '../src/modules/reviews/reviews.service.js';
import { RankingService } from '../src/modules/ranking/ranking.service.js';
import { PaymentArrangementsService } from '../src/modules/bookings/payment-arrangements.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { GuideStatus, ListingCategory, MessageType, ModerationActionType, PaymentArrangement, PriceUnit, PricingType, ReportReason, ReportTargetType, Role, VerificationCheckStatus } from '../src/generated/prisma/client.js';

const databaseUrl = process.env.DATABASE_URL ?? '';
if (process.env.NODE_ENV !== 'test' || !databaseUrl.includes('elch_test')) {
  throw new Error('Integration tests require NODE_ENV=test and an isolated elch_test database');
}

describe('booking reliability', () => {
  const prisma = new PrismaService(new ConfigService({ DATABASE_URL: databaseUrl }));
  const pricing = new PricingService();
  const service = new BookingsService(prisma, pricing);
  const lifecycle = new BookingLifecycleService(prisma);
  const listings = new ListingsService(prisma, pricing);
  const notifications = new NotificationsService(prisma);
  const authConfig = new ConfigService({
    NODE_ENV: 'test',
    JWT_ACCESS_SECRET: 'test-access-secret-at-least-32-characters',
    JWT_REFRESH_SECRET: 'test-refresh-secret-at-least-32-characters',
    JWT_ACCESS_TTL: '15m',
    JWT_REFRESH_TTL: '30d',
    EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS: 60,
  });
  const emailDelivery = new EmailDeliveryService(authConfig);
  const auth = new AuthService(prisma, new JwtService(), authConfig, emailDelivery);
  const guides = new GuidesService(prisma);
  const trust = new TrustSafetyService(prisma);
  const conversations = new ConversationsService(prisma, trust);
  const social = new SocialService(prisma, trust);
  const ranking = new RankingService(prisma);
  const reviews = new ReviewsService(prisma, ranking);
  const payments = new PaymentArrangementsService(prisma);
  let travelerId: string;
  let hostId: string;
  let listingId: string;

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.idempotencyKey.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.emailVerificationToken.deleteMany();
    await prisma.passwordResetToken.deleteMany();
    await prisma.guideVerificationReview.deleteMany();
    await prisma.moderationAction.deleteMany();
    await prisma.report.deleteMany();
    await prisma.userBlock.deleteMany();
    await prisma.review.deleteMany();
    await prisma.pilotPayment.deleteMany();
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
        basePriceMinor: 5000,
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

  it('calculates structured prices exclusively in minor units', () => {
    expect(pricing.calculate({
      basePriceMinor: 10_000,
      units: 2,
      guests: 3,
      currency: 'mnt',
      cleaningFeeMinor: 1_500,
      serviceFeeMinor: 800,
      taxMinor: 2_000,
      extraGuestFeeMinor: 1_000,
      depositMinor: 5_000,
    })).toEqual({
      baseAmountMinor: 20_000,
      cleaningFeeMinor: 1_500,
      serviceFeeMinor: 800,
      taxMinor: 2_000,
      extraGuestFeeMinor: 4_000,
      depositMinor: 5_000,
      amountMinor: 33_300,
      currency: 'MNT',
    });
  });

  it('calculates explainable ranking points with cancellation and report penalties', () => {
    const base = {
      rating: 4.8,
      reviewCount: 20,
      globalRating: 4.2,
      completedTrips: 30,
      responseRate: 90,
      acceptanceRate: 80,
      daysSinceActivity: 5,
      assessmentScore: 80,
      providerCancellations: 0,
      confirmedReports: 0,
    };
    const clean = ranking.calculate(base);
    const penalized = ranking.calculate({ ...base, providerCancellations: 1, confirmedReports: 1 });
    expect(clean.rankPoints - penalized.rankPoints).toBe(150);
    expect(clean.bayesianRating).toBeGreaterThan(base.globalRating);
    expect(clean.assessmentPoints).toBe(40);
  });

  it('hashes, expires, rate-limits, and consumes email verification tokens once', async () => {
    const email = 'verification@test.ventour.mn';
    const session = await auth.register({
      name: 'Verification User',
      email,
      password: 'Password123!',
      role: Role.TRAVELER,
    }, {});
    expect(session.user.emailVerifiedAt).toBeNull();
    const firstToken = emailDelivery.takeTestVerificationToken(email);
    expect(firstToken).toMatch(/^[a-f0-9]{64}$/);
    const stored = await prisma.emailVerificationToken.findFirstOrThrow({
      where: { userId: session.user.id },
    });
    expect(stored.tokenHash).not.toBe(firstToken);
    expect(stored.expiresAt.getTime() - stored.sentAt.getTime()).toBe(30 * 60_000);
    const expiredToken = 'a'.repeat(64);
    await prisma.emailVerificationToken.create({
      data: {
        userId: session.user.id,
        tokenHash: createHash('sha256').update(expiredToken).digest('hex'),
        expiresAt: new Date(Date.now() - 1_000),
      },
    });
    await expect(auth.verifyEmail(expiredToken)).rejects.toMatchObject({ status: 400 });

    await auth.resendVerification(email);
    expect(emailDelivery.takeTestVerificationToken(email)).toBeUndefined();
    await prisma.emailVerificationToken.updateMany({
      where: { userId: session.user.id },
      data: { sentAt: new Date(Date.now() - 61_000) },
    });
    await auth.resendVerification(email);
    const secondToken = emailDelivery.takeTestVerificationToken(email)!;
    expect(secondToken).not.toBe(firstToken);
    await expect(auth.verifyEmail(secondToken)).resolves.toMatchObject({ success: true });
    await expect(auth.verifyEmail(secondToken)).rejects.toMatchObject({ status: 400 });
    await expect(auth.verifyEmail(firstToken!)).rejects.toMatchObject({ status: 400 });
    expect(await prisma.user.findUnique({ where: { id: session.user.id } })).toMatchObject({
      isVerified: true,
      emailVerifiedAt: expect.any(Date),
    });
  });

  it('resets and changes passwords while revoking every active session', async () => {
    const email = 'password-reset@test.ventour.mn';
    const registered = await auth.register({
      name: 'Password Reset User',
      email,
      password: 'OldPassword123!',
      role: Role.TRAVELER,
    }, {});
    emailDelivery.takeTestVerificationToken(email);

    await expect(auth.forgotPassword('missing@test.ventour.mn')).resolves.toEqual({ success: true });
    await auth.forgotPassword(email);
    const resetToken = emailDelivery.takeTestPasswordResetToken(email)!;
    expect(resetToken).toMatch(/^[a-f0-9]{64}$/);
    const stored = await prisma.passwordResetToken.findFirstOrThrow({ where: { userId: registered.user.id } });
    expect(stored.tokenHash).not.toBe(resetToken);
    expect(stored.expiresAt.getTime() - stored.requestedAt.getTime()).toBe(30 * 60_000);
    await auth.forgotPassword(email);
    expect(emailDelivery.takeTestPasswordResetToken(email)).toBeUndefined();

    await expect(auth.resetPassword(resetToken, 'NewPassword123!')).resolves.toEqual({ success: true });
    await expect(auth.resetPassword(resetToken, 'AnotherPassword123!')).rejects.toMatchObject({ status: 400 });
    await expect(auth.refresh(registered.refreshToken, {})).rejects.toMatchObject({ status: 401 });
    await expect(auth.login({ email, password: 'OldPassword123!' }, {})).rejects.toMatchObject({ status: 401 });
    const loggedIn = await auth.login({ email, password: 'NewPassword123!' }, {});

    await expect(auth.changePassword(registered.user.id, 'bad password', 'ChangedPassword456!')).rejects.toMatchObject({ status: 401 });
    await expect(auth.changePassword(registered.user.id, 'NewPassword123!', 'ChangedPassword456!')).resolves.toEqual({ success: true });
    await expect(auth.refresh(loggedIn.refreshToken, {})).rejects.toMatchObject({ status: 401 });
    await expect(auth.login({ email, password: 'ChangedPassword456!' }, {})).resolves.toMatchObject({ user: { id: registered.user.id } });
  });

  it('records immutable guide review audits and requires a rejection reason', async () => {
    const [reviewer, applicant] = await Promise.all([
      prisma.user.create({ data: { email: 'reviewer@test.ventour.mn', name: 'Reviewer', roles: [Role.ADMIN] } }),
      prisma.user.create({ data: { email: 'applicant@test.ventour.mn', name: 'Applicant', roles: [Role.TRAVELER] } }),
    ]);
    const applicationPayload = {
      country: 'Mongolia',
      city: 'Ulaanbaatar',
      bio: 'A detailed guide application biography with enough local experience.',
      experienceYears: 5,
      languages: { Mongolian: 'Native' },
      expertise: ['History', 'City walks'],
      availability: ['Saturday'],
      pricingType: PricingType.NONE,
      referenceContact: 'reference@example.com',
      codeOfConductAccepted: true as const,
    };
    const application = await guides.apply(applicant.id, applicationPayload);
    const assessmentBreakdown = { localKnowledge: 20, communication: 19, safety: 22, professionalism: 21 };
    await expect(guides.reviewApplication(reviewer.id, application.id, {
      decision: GuideReviewDecision.REJECT,
      assessmentBreakdown,
      documentStatus: VerificationCheckStatus.FAILED,
      referenceStatus: VerificationCheckStatus.VERIFIED,
    })).rejects.toMatchObject({ status: 400 });

    await guides.reviewApplication(reviewer.id, application.id, {
      decision: GuideReviewDecision.REJECT,
      decisionReason: 'Identity document could not be verified',
      internalNote: 'Applicant may submit a clearer document.',
      assessmentBreakdown,
      documentStatus: VerificationCheckStatus.FAILED,
      referenceStatus: VerificationCheckStatus.VERIFIED,
    });
    await guides.apply(applicant.id, applicationPayload);
    await guides.reviewApplication(reviewer.id, application.id, {
      decision: GuideReviewDecision.APPROVE,
      decisionReason: 'All checks passed',
      assessmentBreakdown,
      documentStatus: VerificationCheckStatus.VERIFIED,
      referenceStatus: VerificationCheckStatus.VERIFIED,
    });

    const audits = await guides.applicationReviews(application.id);
    expect(audits).toHaveLength(2);
    expect(audits).toEqual(expect.arrayContaining([
      expect.objectContaining({
        reviewerId: reviewer.id,
        decision: 'REJECTED',
        decisionReason: 'Identity document could not be verified',
        assessmentScore: 82,
        applicationSnapshot: expect.objectContaining({ city: 'Ulaanbaatar' }),
      }),
      expect.objectContaining({ reviewerId: reviewer.id, decision: 'APPROVED' }),
    ]));
    expect(await prisma.user.findUnique({ where: { id: applicant.id } })).toMatchObject({ roles: expect.arrayContaining([Role.GUIDE]) });
    expect(await prisma.notification.count({ where: { userId: applicant.id, type: { in: ['GUIDE_APPLICATION_REJECTED', 'GUIDE_APPLICATION_APPROVED'] } } })).toBe(2);
  });

  it('enforces block and mute rules and records moderation actions', async () => {
    const blocker = await prisma.user.create({
      data: { email: 'blocker@test.ventour.mn', name: 'Blocker', roles: [Role.TRAVELER] },
    });
    const targetSession = await auth.register({
      name: 'Reported User',
      email: 'reported@test.ventour.mn',
      password: 'ReportedPassword123!',
      role: Role.TRAVELER,
    }, {});
    emailDelivery.takeTestVerificationToken(targetSession.user.email);
    const targetId = targetSession.user.id;
    const admin = await prisma.user.create({
      data: { email: 'moderator@test.ventour.mn', name: 'Moderator', roles: [Role.ADMIN] },
    });
    await prisma.follow.createMany({ data: [
      { followerId: blocker.id, followingId: targetId },
      { followerId: targetId, followingId: blocker.id },
    ] });
    const post = await social.createPost(targetId, { text: 'A reportable test post' });
    const conversation = await conversations.direct(blocker.id, targetId);

    await conversations.mute(targetId, conversation.id, true);
    await conversations.send(blocker.id, conversation.id, { type: MessageType.TEXT, body: 'Muted message' });
    expect(await prisma.notification.count({ where: { userId: targetId, type: 'NEW_MESSAGE' } })).toBe(0);
    await conversations.mute(targetId, conversation.id, false);
    await conversations.send(blocker.id, conversation.id, { type: MessageType.TEXT, body: 'Visible message' });
    expect(await prisma.notification.count({ where: { userId: targetId, type: 'NEW_MESSAGE' } })).toBe(1);

    await trust.block(blocker.id, targetId);
    expect(await prisma.follow.count({ where: { OR: [{ followerId: blocker.id, followingId: targetId }, { followerId: targetId, followingId: blocker.id }] } })).toBe(0);
    await expect(conversations.send(blocker.id, conversation.id, { type: MessageType.TEXT, body: 'Blocked message' })).rejects.toMatchObject({ status: 403 });
    await expect(social.toggleLike(blocker.id, post.id)).rejects.toMatchObject({ status: 403 });
    await expect(social.comment(blocker.id, post.id, { text: 'Blocked comment' })).rejects.toMatchObject({ status: 403 });
    await expect(social.toggleFollow(targetId, blocker.id)).rejects.toMatchObject({ status: 403 });
    expect((await social.feed(blocker.id)).some((item) => item.id === post.id)).toBe(false);

    const contentReport = await trust.createReport(blocker.id, {
      reason: ReportReason.INAPPROPRIATE_CONTENT,
      targetType: ReportTargetType.POST,
      targetId: post.id,
      details: 'Test moderation content report',
    });
    await trust.moderate(admin.id, contentReport.id, {
      action: ModerationActionType.CONTENT_REMOVE,
      reason: 'Content violated pilot safety policy',
    });
    expect(await prisma.post.findUnique({ where: { id: post.id } })).toMatchObject({ deletedAt: expect.any(Date) });

    const userReport = await trust.createReport(blocker.id, {
      reason: ReportReason.HARASSMENT,
      targetType: ReportTargetType.USER,
      targetId,
      details: 'Test user report',
    });
    await trust.moderate(admin.id, userReport.id, {
      action: ModerationActionType.TEMPORARY_SUSPENSION,
      reason: 'Temporary safety suspension',
      durationHours: 24,
    });
    expect(await prisma.moderationAction.count({ where: { adminId: admin.id } })).toBe(2);
    await expect(auth.refresh(targetSession.refreshToken, {})).rejects.toMatchObject({ status: 401 });
    await expect(auth.login({ email: targetSession.user.email, password: 'ReportedPassword123!' }, {})).rejects.toMatchObject({ status: 401 });
    await prisma.user.update({ where: { id: targetId }, data: { suspendedUntil: new Date(Date.now() - 1_000) } });
    await expect(auth.login({ email: targetSession.user.email, password: 'ReportedPassword123!' }, {})).resolves.toMatchObject({ user: { id: targetId } });
  });

  it('allows exactly one verified traveler review for a completed booking', async () => {
    const pending = await prisma.booking.create({
      data: {
        travelerId,
        guideId: hostId,
        startsAt: new Date(Date.now() - 7_200_000),
        endsAt: new Date(Date.now() - 3_600_000),
        amount: '20.00',
        amountMinor: 2000,
        baseAmountMinor: 2000,
      },
    });
    await expect(reviews.create(travelerId, { bookingId: pending.id, rating: 5, text: 'A detailed pending review' })).rejects.toMatchObject({ status: 409 });
    const completed = await prisma.booking.create({
      data: {
        travelerId,
        guideId: hostId,
        startsAt: new Date(Date.now() - 7_200_000),
        endsAt: new Date(Date.now() - 3_600_000),
        amount: '20.00',
        amountMinor: 2000,
        baseAmountMinor: 2000,
        status: 'COMPLETED',
      },
    });
    await expect(reviews.create(hostId, { bookingId: completed.id, rating: 5, text: 'Provider cannot review own trip' })).rejects.toMatchObject({ status: 409 });
    await expect(reviews.create(travelerId, { bookingId: completed.id, rating: 5, text: 'An excellent and safe local experience.' })).resolves.toMatchObject({
      bookingId: completed.id,
      guideId: hostId,
      rating: 5,
    });
    await expect(reviews.create(travelerId, { bookingId: completed.id, rating: 4, text: 'Trying to review the same booking twice.' })).rejects.toMatchObject({ status: 409 });
    expect(await prisma.guideProfile.findUnique({ where: { userId: hostId } })).toMatchObject({ rating: expect.anything(), reviewCount: 1 });
    expect(await reviews.list({ guideId: hostId })).toEqual([
      expect.objectContaining({ bookingId: completed.id, rating: 5 }),
    ]);
  });

  it('recalculates response, acceptance, activity, and cancellation ranking metrics', async () => {
    const now = new Date();
    const statuses = ['DECLINED', 'EXPIRED', 'CANCELLED_BY_PROVIDER'] as const;
    await Promise.all(statuses.map((status, index) => prisma.booking.create({
      data: {
        travelerId,
        guideId: hostId,
        startsAt: new Date(now.getTime() - (index + 5) * 3_600_000),
        endsAt: new Date(now.getTime() - (index + 4) * 3_600_000),
        amount: '20.00',
        amountMinor: 2000,
        baseAmountMinor: 2000,
        status,
      },
    })));
    const updated = await ranking.recalculateGuide(hostId, now);
    expect(updated).toMatchObject({
      responseRate: 75,
      acceptanceRate: 50,
      providerCancellationCount: 1,
      confirmedReportCount: 0,
      rankingUpdatedAt: now,
    });
  });

  it('requires both parties to agree to a pilot payment arrangement before marking it paid', async () => {
    const booking = await prisma.booking.create({
      data: {
        travelerId,
        guideId: hostId,
        startsAt: new Date(Date.now() + 10 * 3_600_000),
        endsAt: new Date(Date.now() + 12 * 3_600_000),
        amount: '40.00',
        amountMinor: 4000,
        baseAmountMinor: 4000,
        status: 'CONFIRMED',
      },
    });
    await expect(payments.propose(travelerId, booking.id, { arrangement: PaymentArrangement.ONLINE_PAYMENT })).rejects.toMatchObject({ status: 409 });
    await expect(payments.propose(travelerId, booking.id, {
      arrangement: PaymentArrangement.CASH_ON_ARRIVAL,
      instructions: 'Pay the guide after the experience.',
    })).resolves.toMatchObject({ status: 'PENDING', agreedByTravelerAt: expect.any(Date), agreedByProviderAt: null });
    await expect(payments.markPaid(hostId, booking.id)).rejects.toMatchObject({ status: 409 });
    await expect(payments.agree(hostId, booking.id)).resolves.toMatchObject({ status: 'AGREED', agreedByProviderAt: expect.any(Date) });
    await expect(payments.markPaid(travelerId, booking.id)).rejects.toMatchObject({ status: 403 });
    await expect(payments.markPaid(hostId, booking.id)).resolves.toMatchObject({ status: 'PAID', paidAt: expect.any(Date) });
  });

  it('rejects listing and guide self-booking', async () => {
    await expect(service.create(hostId, { listingId, ...interval(1) }, randomUUID()))
      .rejects.toMatchObject({ response: { code: 'SELF_BOOKING_NOT_ALLOWED' } });
    await expect(service.create(hostId, { guideId: hostId, ...interval(2) }, randomUUID()))
      .rejects.toMatchObject({ response: { code: 'SELF_BOOKING_NOT_ALLOWED' } });
  });

  it('keeps a booking draft inert until its owning traveler explicitly submits it', async () => {
    const payload = { listingId, ...interval(60) };
    const inventoryDate = new Date(`${payload.startsAt.slice(0, 10)}T00:00:00.000Z`);
    const providerNotificationsBefore = await prisma.notification.count({ where: { userId: hostId } });
    const key = randomUUID();
    const draft = await service.createDraft(travelerId, payload, key) as { id: string; status: string; expiresAt: Date | null };
    const replay = await service.createDraft(travelerId, payload, key) as { id: string };

    expect(replay.id).toBe(draft.id);
    expect(draft).toMatchObject({ status: 'DRAFT', expiresAt: null });
    expect(await prisma.listingInventory.findUnique({
      where: { listingId_date: { listingId, date: inventoryDate } },
    })).toBeNull();
    expect(await prisma.bookingEvent.count({ where: { bookingId: draft.id } })).toBe(0);
    expect(await prisma.conversation.count({ where: { bookingId: draft.id } })).toBe(0);
    expect(await prisma.pilotPayment.count({ where: { bookingId: draft.id } })).toBe(0);
    expect(await prisma.notification.count({ where: { userId: hostId } })).toBe(providerNotificationsBefore);
    expect((await service.listProvider(hostId)).some((booking) => booking.id === draft.id)).toBe(false);
    await expect(service.updateStatus(hostId, draft.id, BookingAction.ACCEPT)).rejects.toBeInstanceOf(ConflictException);

    const otherTraveler = await prisma.user.create({
      data: { email: 'draft-owner-check@test.ventour.mn', name: 'Other Traveler', roles: [Role.TRAVELER] },
    });
    await expect(service.submitDraft(otherTraveler.id, draft.id)).rejects.toMatchObject({ status: 404 });

    const submitted = await service.submitDraft(travelerId, draft.id);
    expect(submitted).toMatchObject({ id: draft.id, status: 'PENDING', expiresAt: expect.any(Date) });
    expect(await prisma.listingInventory.findUnique({
      where: { listingId_date: { listingId, date: inventoryDate } },
    })).toMatchObject({ reservedUnits: 1, availableUnits: 0 });
    expect(await prisma.bookingEvent.findMany({ where: { bookingId: draft.id } })).toEqual([
      expect.objectContaining({ fromStatus: 'DRAFT', toStatus: 'PENDING', eventType: 'DRAFT_SUBMITTED' }),
    ]);
    expect(await prisma.conversation.findUnique({ where: { bookingId: draft.id } })).toBeDefined();
    expect(await prisma.notification.count({ where: { userId: hostId } })).toBe(providerNotificationsBefore + 1);
    expect((await service.listProvider(hostId)).some((booking) => booking.id === draft.id)).toBe(true);
    await expect(service.submitDraft(travelerId, draft.id)).rejects.toBeInstanceOf(ConflictException);
  });

  it('revalidates guide availability atomically when competing drafts are submitted', async () => {
    const secondTraveler = await prisma.user.create({
      data: { email: 'draft-race@test.ventour.mn', name: 'Draft Race Traveler', roles: [Role.TRAVELER] },
    });
    const payload = { guideId: hostId, ...interval(61) };
    const first = await service.createDraft(travelerId, payload, randomUUID()) as { id: string };
    const second = await service.createDraft(secondTraveler.id, payload, randomUUID()) as { id: string };

    await expect(service.submitDraft(travelerId, first.id)).resolves.toMatchObject({ status: 'PENDING' });
    await expect(service.submitDraft(secondTraveler.id, second.id)).rejects.toMatchObject({
      response: { code: 'BOOKING_TIME_UNAVAILABLE' },
    });
    expect(await prisma.booking.findUnique({ where: { id: second.id } })).toMatchObject({ status: 'DRAFT' });
    expect(await prisma.bookingEvent.count({ where: { bookingId: second.id } })).toBe(0);
    expect(await prisma.conversation.count({ where: { bookingId: second.id } })).toBe(0);
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

  it('notifies the provider and enforces notification ownership', async () => {
    const created = await service.create(travelerId, { listingId, ...interval(31) }, randomUUID()) as { id: string };
    const hostNotifications = await notifications.list(hostId);
    const item = hostNotifications.items.find((notification) =>
      notification.type === 'BOOKING_CREATED' &&
      (notification.data as { bookingId?: string } | null)?.bookingId === created.id,
    );
    expect(item).toBeDefined();
    expect(hostNotifications.unreadCount).toBeGreaterThan(0);
    await expect(notifications.markRead(travelerId, item!.id)).rejects.toMatchObject({ status: 404 });
    expect(await notifications.markRead(hostId, item!.id)).toMatchObject({ readAt: expect.any(Date) });

    await service.updateStatus(hostId, created.id, BookingAction.ACCEPT);
    const travelerNotifications = await notifications.list(travelerId);
    expect(travelerNotifications.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'BOOKING_ACCEPTED' }),
    ]));
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
        amountMinor: 5000,
        baseAmountMinor: 5000,
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
        amountMinor: 2000,
        baseAmountMinor: 2000,
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
      basePriceMinor: 7500,
      cleaningFeeMinor: 1000,
      serviceFeeMinor: 500,
      taxMinor: 250,
      extraGuestFeeMinor: 1200,
      depositMinor: 2000,
      currency: 'USD',
      priceUnit: PriceUnit.PER_NIGHT,
      datesLabel: 'Flexible dates',
      tags: ['test'],
      amenities: ['wifi'],
      defaultTotalUnits: 2,
      images: [],
    });
    expect(draft).toMatchObject({ status: 'DRAFT', published: false });
    expect(await listings.publish(hostId, draft.id)).toMatchObject({ status: 'PUBLISHED', published: true });
    expect(await listings.update(hostId, draft.id, { basePriceMinor: 8000 })).toMatchObject({ basePriceMinor: 8000 });
    const payload = { listingId: draft.id, ...interval(40), guests: 3 };
    expect(await service.quote(travelerId, payload)).toEqual(expect.objectContaining({
      baseAmountMinor: 8000,
      extraGuestFeeMinor: 2400,
      amountMinor: 14_150,
      currency: 'USD',
    }));
    expect(await service.create(travelerId, payload, randomUUID())).toMatchObject({
      baseAmountMinor: 8000,
      extraGuestFeeMinor: 2400,
      amountMinor: 14_150,
      currency: 'USD',
    });
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
