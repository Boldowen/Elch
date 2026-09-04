import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { jest } from '@jest/globals';
import {
  Role,
  RouteRiskLevel,
  SafetyPlanAuditAction,
  SafetyPlanStatus,
} from '../src/generated/prisma/client.js';
import { ROLES_KEY } from '../src/common/decorators/roles.decorator.js';
import { RoutePlanningService } from '../src/modules/route-planning/route-planning.service.js';
import { RouteRiskPolicyService } from '../src/modules/route-planning/route-risk-policy.service.js';
import { SafetyPlanController } from '../src/modules/route-planning/safety-plan.controller.js';
import { SafetyPlanService } from '../src/modules/route-planning/safety-plan.service.js';
import type { HydratedResearchRoute } from '../src/modules/route-planning/route.types.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

const routeId = '10000000-0000-4000-8000-000000000001';
const planId = '20000000-0000-4000-8000-000000000001';
const creatorId = '30000000-0000-4000-8000-000000000001';
const guideUserId = '40000000-0000-4000-8000-000000000001';
const guideProfileId = '50000000-0000-4000-8000-000000000001';
const adminId = '60000000-0000-4000-8000-000000000001';

function planRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: planId,
    routeId,
    createdById: creatorId,
    guideProfileId,
    reviewedById: null,
    title: 'Western Altai operational safety plan',
    tripStartAt: new Date('2030-07-01T00:00:00.000Z'),
    tripEndAt: new Date('2030-07-07T00:00:00.000Z'),
    riskLevelSnapshot: RouteRiskLevel.R4,
    itinerary: [
      { day: 1, nodeCode: 'alpha', activity: 'Meet the expedition team' },
      { day: 2, nodeCode: 'beta', activity: 'Travel with the assigned guide' },
    ],
    emergencyContacts: [{ name: 'Emergency desk', role: 'Coordinator', phone: '+976 7000 0000' }],
    communicationsPlan: 'Daily satellite check-ins with the operations coordinator.',
    evacuationPlan: 'Return to the trailhead and contact the regional rescue unit.',
    medicalPlan: 'The guide carries first aid supplies and records health concerns.',
    riskMitigations: ['Weather check', 'Turnaround threshold'],
    equipmentChecklist: ['Satellite phone', 'First aid kit'],
    permitReferences: ['permit-1'],
    status: SafetyPlanStatus.DRAFT,
    version: 1,
    submittedAt: null,
    approvedAt: null,
    rejectedAt: null,
    revokedAt: null,
    expiresAt: null,
    reviewNotes: null,
    createdAt: new Date('2026-08-27T00:00:00.000Z'),
    updatedAt: new Date('2026-08-27T00:00:00.000Z'),
    route: {
      id: routeId,
      code: 'western-altai',
      name: 'Western Altai',
      riskLevel: RouteRiskLevel.R4,
      active: true,
    },
    guideProfile: {
      id: guideProfileId,
      status: 'APPROVED',
      verified: true,
      user: { id: guideUserId, name: 'Assigned Guide' },
    },
    createdBy: { id: creatorId, name: 'Plan Creator' },
    reviewedBy: null,
    auditEntries: [],
    ...overrides,
  };
}

function transitionHarness(initial = planRecord()) {
  let current = { ...initial };
  const audits: Array<Record<string, unknown>> = [];
  const updateMany = jest.fn(async ({ where, data }: {
    where: { id: string; status: SafetyPlanStatus; version: number };
    data: Record<string, unknown>;
  }) => {
    if (where.id !== current.id || where.status !== current.status || where.version !== current.version) {
      return { count: 0 };
    }
    const next = { ...current } as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      if (key === 'version' && value && typeof value === 'object' && 'increment' in value) {
        next.version = Number(next.version) + Number((value as { increment: number }).increment);
      } else {
        next[key] = value;
      }
    }
    current = next as typeof current;
    return { count: 1 };
  });
  const safetyPlan = {
    findFirst: jest.fn(async () => current),
    findUnique: jest.fn(async () => current),
    findUniqueOrThrow: jest.fn(async () => current),
    findMany: jest.fn(async () => [] as Array<typeof current>),
    updateMany,
    create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
      current = planRecord({ ...data, id: planId }) as typeof current;
      return current;
    }),
  };
  const safetyPlanAudit = {
    create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
      audits.push(data);
      return data;
    }),
  };
  const tx = { safetyPlan, safetyPlanAudit };
  const prisma = {
    safetyPlan,
    safetyPlanAudit,
    $transaction: jest.fn((callback: (client: typeof tx) => Promise<unknown>) => callback(tx)),
  };
  return { prisma, safetyPlan, safetyPlanAudit, updateMany, audits, current: () => current };
}

function createDto() {
  return {
    routeId: 'western-altai',
    guideProfileId,
    title: 'Western Altai operational safety plan',
    tripStartAt: '2030-07-01T00:00:00.000Z',
    tripEndAt: '2030-07-07T00:00:00.000Z',
    itinerary: [
      { day: 1, nodeCode: 'alpha', activity: 'Meet the expedition team' },
      { day: 2, nodeCode: 'beta', activity: 'Travel with the assigned guide' },
    ],
    emergencyContacts: [{ name: 'Emergency desk', role: 'Coordinator', phone: '+976 7000 0000' }],
    communicationsPlan: 'Daily satellite check-ins with the operations coordinator.',
    evacuationPlan: 'Return to the trailhead and contact the regional rescue unit.',
    medicalPlan: 'The guide carries first aid supplies and records health concerns.',
    riskMitigations: ['Weather check', 'Turnaround threshold'],
    equipmentChecklist: ['Satellite phone', 'First aid kit'],
    permitReferences: ['permit-1'],
  };
}

describe('SafetyPlanService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-27T00:00:00.000Z'));
  });

  afterEach(() => jest.useRealTimers());

  it.each([RouteRiskLevel.R0, RouteRiskLevel.R1, RouteRiskLevel.R2])(
    'refuses to create a safety approval record for %s routes',
    async (riskLevel) => {
      const prisma = {
        researchRoute: { findFirst: jest.fn(async () => ({ id: routeId, code: 'route', riskLevel })) },
      };
      const service = new SafetyPlanService(prisma as unknown as PrismaService);

      await expect(service.create(creatorId, [Role.TRAVELER], createDto()))
        .rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it('requires a verified approved guide and prevents guides assigning another profile', async () => {
    const base = {
      researchRoute: {
        findFirst: jest.fn(async () => ({ id: routeId, code: 'western-altai', riskLevel: RouteRiskLevel.R4 })),
      },
      routeNode: { count: jest.fn(async () => 2) },
      guideProfile: { findFirst: jest.fn(async () => null) },
    };
    await expect(new SafetyPlanService(base as unknown as PrismaService)
      .create(creatorId, [Role.TRAVELER], createDto()))
      .rejects.toBeInstanceOf(BadRequestException);

    base.guideProfile.findFirst.mockResolvedValue({ id: guideProfileId, userId: guideUserId } as never);
    await expect(new SafetyPlanService(base as unknown as PrismaService)
      .create(creatorId, [Role.GUIDE], createDto()))
      .rejects.toBeInstanceOf(ForbiddenException);
  });

  it('creates an R4 draft with a risk snapshot and immutable-style CREATED audit snapshot', async () => {
    const harness = transitionHarness();
    const prisma = {
      ...harness.prisma,
      researchRoute: {
        findFirst: jest.fn(async () => ({ id: routeId, code: 'western-altai', riskLevel: RouteRiskLevel.R4 })),
      },
      routeNode: { count: jest.fn(async () => 2) },
      guideProfile: {
        findFirst: jest.fn(async () => ({ id: guideProfileId, userId: guideUserId })),
      },
    };
    const result = await new SafetyPlanService(prisma as unknown as PrismaService)
      .create(creatorId, [Role.TRAVELER], createDto());

    expect(result).toMatchObject({
      id: planId,
      routeId,
      createdById: creatorId,
      guideProfileId,
      riskLevelSnapshot: RouteRiskLevel.R4,
      status: SafetyPlanStatus.DRAFT,
      version: 1,
    });
    expect(harness.safetyPlanAudit.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        safetyPlanId: planId,
        actorId: creatorId,
        action: SafetyPlanAuditAction.CREATED,
        fromStatus: null,
        toStatus: SafetyPlanStatus.DRAFT,
        planVersion: 1,
        snapshot: expect.objectContaining({
          status: SafetyPlanStatus.DRAFT,
          riskLevelSnapshot: RouteRiskLevel.R4,
        }),
      }),
    });
  });

  it('allows only the creator/assigned guide or an administrator to read a plan', async () => {
    const harness = transitionHarness();
    const service = new SafetyPlanService(harness.prisma as unknown as PrismaService);

    await expect(service.get('unrelated-user', [Role.TRAVELER], planId))
      .rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.get(creatorId, [Role.TRAVELER], planId))
      .resolves.toMatchObject({ id: planId });
    await expect(service.get(guideUserId, [Role.GUIDE], planId))
      .resolves.toMatchObject({ id: planId });
    await expect(service.get('administrator', [Role.ADMIN], planId))
      .resolves.toMatchObject({ id: planId });

    harness.safetyPlan.findUnique.mockResolvedValueOnce(null as never);
    await expect(service.get(creatorId, [Role.TRAVELER], 'missing'))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('limits edits to an owned draft and fails closed on a compare-and-swap race', async () => {
    const missingOwner = transitionHarness();
    missingOwner.safetyPlan.findFirst.mockResolvedValueOnce(null as never);
    await expect(new SafetyPlanService(missingOwner.prisma as unknown as PrismaService)
      .update('another-user', planId, { title: 'A sufficiently long replacement title' }))
      .rejects.toBeInstanceOf(NotFoundException);

    const submitted = transitionHarness(planRecord({ status: SafetyPlanStatus.SUBMITTED }));
    await expect(new SafetyPlanService(submitted.prisma as unknown as PrismaService)
      .update(creatorId, planId, { title: 'A sufficiently long replacement title' }))
      .rejects.toBeInstanceOf(ConflictException);

    const raced = transitionHarness();
    raced.updateMany.mockResolvedValueOnce({ count: 0 });
    await expect(new SafetyPlanService(raced.prisma as unknown as PrismaService)
      .update(creatorId, planId, { title: 'A sufficiently long replacement title' }))
      .rejects.toBeInstanceOf(ConflictException);
    expect(raced.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ id: planId, status: SafetyPlanStatus.DRAFT, version: 1 }),
    }));
    expect(raced.safetyPlanAudit.create).not.toHaveBeenCalled();
  });

  it('submits with CAS and records the complete DRAFT to SUBMITTED transition', async () => {
    const harness = transitionHarness();
    const result = await new SafetyPlanService(harness.prisma as unknown as PrismaService)
      .submit(creatorId, planId);

    expect(result).toMatchObject({ status: SafetyPlanStatus.SUBMITTED, version: 2 });
    expect(harness.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: planId, status: SafetyPlanStatus.DRAFT, version: 1 },
      data: expect.objectContaining({ status: SafetyPlanStatus.SUBMITTED, version: { increment: 1 } }),
    }));
    expect(harness.audits).toEqual([
      expect.objectContaining({
        actorId: creatorId,
        action: SafetyPlanAuditAction.SUBMITTED,
        fromStatus: SafetyPlanStatus.DRAFT,
        toStatus: SafetyPlanStatus.SUBMITTED,
        planVersion: 2,
        snapshot: expect.objectContaining({ status: SafetyPlanStatus.SUBMITTED, version: 2 }),
      }),
    ]);
  });

  it('requires rejection notes and refuses review after route risk or activity changes', async () => {
    const submitted = planRecord({ status: SafetyPlanStatus.SUBMITTED, version: 2 });
    const harness = transitionHarness(submitted);
    const service = new SafetyPlanService(harness.prisma as unknown as PrismaService);

    await expect(service.review(adminId, planId, { decision: SafetyPlanStatus.REJECTED }))
      .rejects.toBeInstanceOf(BadRequestException);
    harness.safetyPlan.findUnique.mockResolvedValueOnce(planRecord({
      status: SafetyPlanStatus.SUBMITTED,
      version: 2,
      route: { ...submitted.route, active: false },
    }) as never);
    await expect(service.review(adminId, planId, {
      decision: SafetyPlanStatus.APPROVED,
      notes: 'Reviewed by operations',
    })).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([
    {
      decision: SafetyPlanStatus.APPROVED,
      notes: 'All route and evacuation controls were reviewed',
      status: SafetyPlanStatus.APPROVED,
      action: SafetyPlanAuditAction.APPROVED,
    },
    {
      decision: SafetyPlanStatus.REJECTED,
      notes: 'The evacuation contact chain is incomplete',
      status: SafetyPlanStatus.REJECTED,
      action: SafetyPlanAuditAction.REJECTED,
    },
  ])('persists an admin $decision decision and matching audit', async ({ decision, notes, status, action }) => {
    const initial = planRecord({ status: SafetyPlanStatus.SUBMITTED, version: 2 });
    const harness = transitionHarness(initial);
    const result = await new SafetyPlanService(harness.prisma as unknown as PrismaService)
      .review(adminId, planId, { decision, notes });

    expect(result).toMatchObject({ status, reviewedById: adminId, reviewNotes: notes, version: 3 });
    if (status === SafetyPlanStatus.APPROVED) {
      expect(result).toMatchObject({ approvedAt: expect.any(Date), expiresAt: initial.tripEndAt });
    } else {
      expect(result).toMatchObject({ rejectedAt: expect.any(Date), expiresAt: null });
    }
    expect(harness.audits).toEqual([
      expect.objectContaining({
        actorId: adminId,
        action,
        fromStatus: SafetyPlanStatus.SUBMITTED,
        toStatus: status,
        planVersion: 3,
        reason: notes,
      }),
    ]);
  });

  it('revokes only an approved plan and records the reason in its audit', async () => {
    const draft = transitionHarness();
    await expect(new SafetyPlanService(draft.prisma as unknown as PrismaService)
      .revoke(adminId, planId, { reason: 'Route closure issued by the authority' }))
      .rejects.toBeInstanceOf(ConflictException);

    const approved = transitionHarness(planRecord({
      status: SafetyPlanStatus.APPROVED,
      version: 3,
      reviewedById: adminId,
      approvedAt: new Date('2026-08-26T00:00:00.000Z'),
      expiresAt: new Date('2030-07-07T00:00:00.000Z'),
    }));
    const result = await new SafetyPlanService(approved.prisma as unknown as PrismaService)
      .revoke(adminId, planId, { reason: 'Route closure issued by the authority' });

    expect(result).toMatchObject({ status: SafetyPlanStatus.REVOKED, revokedAt: expect.any(Date), version: 4 });
    expect(approved.audits).toEqual([
      expect.objectContaining({
        actorId: adminId,
        action: SafetyPlanAuditAction.REVOKED,
        fromStatus: SafetyPlanStatus.APPROVED,
        toStatus: SafetyPlanStatus.REVOKED,
        reason: 'Route closure issued by the authority',
      }),
    ]);
  });

  it('expires each due approval through CAS and creates a system-authored audit', async () => {
    const expired = planRecord({
      status: SafetyPlanStatus.APPROVED,
      version: 3,
      reviewedById: adminId,
      approvedAt: new Date('2026-08-20T00:00:00.000Z'),
      expiresAt: new Date('2026-08-26T00:00:00.000Z'),
    });
    const harness = transitionHarness(expired);
    harness.safetyPlan.findMany.mockResolvedValueOnce([expired] as never);

    await expect(new SafetyPlanService(harness.prisma as unknown as PrismaService)
      .expireDuePlans(new Date('2026-08-27T00:00:00.000Z'))).resolves.toBe(1);
    expect(harness.current()).toMatchObject({ status: SafetyPlanStatus.EXPIRED, version: 4 });
    expect(harness.audits).toEqual([
      expect.objectContaining({
        action: SafetyPlanAuditAction.EXPIRED,
        fromStatus: SafetyPlanStatus.APPROVED,
        toStatus: SafetyPlanStatus.EXPIRED,
        planVersion: 4,
      }),
    ]);
    expect(harness.audits[0]).not.toHaveProperty('actorId');
  });

  it('binds validation to actor, route, guide, full dates, an admin reviewer, and its approval audit', async () => {
    const findFirst = jest.fn(async () => ({
      id: planId,
      status: SafetyPlanStatus.APPROVED,
      approvedAt: new Date('2026-08-26T00:00:00.000Z'),
      expiresAt: new Date('2030-07-07T00:00:00.000Z'),
      reviewedById: adminId,
      auditEntries: [{ actorId: adminId }],
    }));
    const prisma = {
      safetyPlan: { findMany: jest.fn(async () => []), findFirst },
    };
    const service = new SafetyPlanService(prisma as unknown as PrismaService);
    const now = new Date('2026-08-27T00:00:00.000Z');
    const travelStart = new Date('2030-07-01T00:00:00.000Z');
    const travelEnd = new Date('2030-07-04T00:00:00.000Z');

    await expect(service.approvedForValidation(
      planId,
      creatorId,
      routeId,
      guideProfileId,
      travelStart,
      now,
      travelEnd,
    )).resolves.toEqual(expect.objectContaining({ id: planId, reviewedById: adminId }));
    expect(findFirst).toHaveBeenCalledWith({
      where: expect.objectContaining({
        id: planId,
        routeId,
        guideProfileId,
        reviewedById: { not: null },
        reviewedBy: { roles: { has: Role.ADMIN } },
        tripStartAt: { lte: travelStart },
        tripEndAt: { gte: travelEnd },
        OR: [{ createdById: creatorId }, { guideProfile: { userId: creatorId } }],
      }),
      select: expect.objectContaining({
        auditEntries: expect.objectContaining({
          where: expect.objectContaining({
            action: SafetyPlanAuditAction.APPROVED,
            actorId: { not: null },
          }),
        }),
      }),
    });
  });

  it('rejects approval rows whose audit actor does not match the recorded reviewer', async () => {
    const prisma = {
      safetyPlan: {
        findMany: jest.fn(async () => []),
        findFirst: jest.fn(async () => ({
          id: planId,
          status: SafetyPlanStatus.APPROVED,
          approvedAt: new Date(),
          expiresAt: new Date('2030-07-07T00:00:00.000Z'),
          reviewedById: adminId,
          auditEntries: [{ actorId: 'a-different-reviewer' }],
        })),
      },
    };
    const result = await new SafetyPlanService(prisma as unknown as PrismaService)
      .approvedForValidation(
        planId,
        creatorId,
        routeId,
        guideProfileId,
        new Date('2030-07-01T00:00:00.000Z'),
      );
    expect(result).toBeNull();
  });
});

describe('Safety-plan authorization metadata', () => {
  it('reserves review/revoke/queue for admins and create/update/submit for travelers or guides', () => {
    expect(Reflect.getMetadata(ROLES_KEY, SafetyPlanController.prototype.review)).toEqual([Role.ADMIN]);
    expect(Reflect.getMetadata(ROLES_KEY, SafetyPlanController.prototype.revoke)).toEqual([Role.ADMIN]);
    expect(Reflect.getMetadata(ROLES_KEY, SafetyPlanController.prototype.queue)).toEqual([Role.ADMIN]);
    expect(Reflect.getMetadata(ROLES_KEY, SafetyPlanController.prototype.create)).toEqual([
      Role.TRAVELER,
      Role.GUIDE,
    ]);
    expect(Reflect.getMetadata(ROLES_KEY, SafetyPlanController.prototype.update)).toEqual([
      Role.TRAVELER,
      Role.GUIDE,
    ]);
    expect(Reflect.getMetadata(ROLES_KEY, SafetyPlanController.prototype.submit)).toEqual([
      Role.TRAVELER,
      Role.GUIDE,
    ]);
  });
});

describe('RoutePlanningService safety-plan binding', () => {
  it('requires the approval to cover the itinerary final day, not only its start date', async () => {
    const route: HydratedResearchRoute = {
      databaseId: routeId,
      id: 'western-altai-test',
      name: 'Western Altai Test Route',
      description: 'An isolated high-risk route used to verify approval binding.',
      routeFamily: 'WESTERN_ALTAI',
      recommendedDays: { min: 2, max: 7 },
      poiIds: ['alpha', 'beta'],
      riskClass: 'R3',
      guideRequirements: {
        minimumLanguageLevel: 'B2',
        routeBadge: 'western-altai-test',
        firstAidRequired: true,
        legalRole: 'SPECIALIST_INSTRUCTOR',
        specialtySkills: [],
      },
      active: true,
      pois: [],
      edges: [{
        id: 'alpha-beta',
        from: 'alpha',
        to: 'beta',
        mode: 'TREK',
        distanceKm: 10,
        nominalMinutes: 120,
        openMonths: [7],
        riskClass: 'R3',
        requiredSkills: [],
        sourceId: 'route-source',
      }],
      sources: [{
        id: 'route-source',
        title: 'Current route source',
        url: 'https://example.com/current-route-source',
        authority: 4,
        lastVerifiedAt: '2026-08-20T00:00:00.000Z',
        verificationStatus: 'HUMAN_VERIFIED',
      }],
      disclaimer: 'Research preflight only.',
    };
    const graph = { find: jest.fn(async () => route) };
    const prisma = {
      guideProfile: {
        findFirst: jest.fn(async () => ({
          legalRole: 'SPECIALIST_INSTRUCTOR',
          languageAssessments: [{ humanVerifiedCefr: 'C1' }],
          routeCompetencies: [{ id: 'route-competency' }],
          firstAidRecords: [{ id: 'first-aid' }],
          competencies: [],
        })),
      },
    };
    const approval = {
      id: planId,
      status: SafetyPlanStatus.APPROVED,
      approvedAt: new Date('2026-08-26T00:00:00.000Z'),
      expiresAt: new Date('2030-07-07T00:00:00.000Z'),
      reviewedById: adminId,
    };
    const safetyPlans = { approvedForValidation: jest.fn(async () => approval) };
    const now = new Date('2026-08-27T00:00:00.000Z');
    const service = new RoutePlanningService(
      new RouteRiskPolicyService(),
      prisma as unknown as PrismaService,
      graph as never,
      safetyPlans as unknown as SafetyPlanService,
    );

    const result = await service.validateAuthoritative({
      routeId: route.id,
      guideProfileId,
      safetyPlanId: planId,
      guideLanguage: 'en',
      startDate: '2030-07-01T00:00:00.000Z',
      permitConfirmed: true,
      stops: [
        { poiId: 'alpha', day: 1, activityMinutes: 60 },
        { poiId: 'beta', day: 4, activityMinutes: 60 },
      ],
    }, now, creatorId);

    expect(safetyPlans.approvedForValidation).toHaveBeenCalledWith(
      planId,
      creatorId,
      routeId,
      guideProfileId,
      new Date('2030-07-01T00:00:00.000Z'),
      now,
      new Date('2030-07-04T00:00:00.000Z'),
    );
    expect(result.safetyApproval).toMatchObject({ approved: true, safetyPlanId: planId });
    expect(result.valid).toBe(true);
  });
});
