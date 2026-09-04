import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  GuideStatus,
  Prisma,
  Role,
  RouteRiskLevel,
  SafetyPlanAuditAction,
  SafetyPlanStatus,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateSafetyPlanDto,
  ReviewSafetyPlanDto,
  RevokeSafetyPlanDto,
  UpdateSafetyPlanDto,
} from './dto/safety-plan.dto.js';

const safetyPlanInclude = {
  route: { select: { id: true, code: true, name: true, riskLevel: true, active: true } },
  guideProfile: {
    select: {
      id: true,
      status: true,
      verified: true,
      user: { select: { id: true, name: true } },
    },
  },
  createdBy: { select: { id: true, name: true } },
  reviewedBy: { select: { id: true, name: true } },
  auditEntries: {
    orderBy: { createdAt: 'asc' as const },
    include: { actor: { select: { id: true, name: true } } },
  },
} satisfies Prisma.SafetyPlanInclude;

type SafetyPlanRecord = Prisma.SafetyPlanGetPayload<{ include: typeof safetyPlanInclude }>;
type SafetyPlanSnapshotInput = Pick<
  SafetyPlanRecord,
  | 'id'
  | 'routeId'
  | 'createdById'
  | 'guideProfileId'
  | 'title'
  | 'tripStartAt'
  | 'tripEndAt'
  | 'riskLevelSnapshot'
  | 'itinerary'
  | 'emergencyContacts'
  | 'communicationsPlan'
  | 'evacuationPlan'
  | 'medicalPlan'
  | 'riskMitigations'
  | 'equipmentChecklist'
  | 'permitReferences'
  | 'status'
  | 'version'
  | 'submittedAt'
  | 'approvedAt'
  | 'rejectedAt'
  | 'revokedAt'
  | 'expiresAt'
  | 'reviewedById'
  | 'reviewNotes'
>;

@Injectable()
export class SafetyPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(actorId: string, roles: string[], dto: CreateSafetyPlanDto) {
    const route = await this.resolveRoute(dto.routeId);
    if (this.riskValue(route.riskLevel) < 3) {
      throw new BadRequestException('Safety-plan approval is reserved for R3/R4 routes');
    }
    const tripStartAt = new Date(dto.tripStartAt);
    const tripEndAt = new Date(dto.tripEndAt);
    this.assertTripWindow(tripStartAt, tripEndAt);
    await this.assertItinerary(route.id, dto.itinerary.map((item) => item.nodeCode));
    const guide = await this.prisma.guideProfile.findFirst({
      where: {
        id: dto.guideProfileId,
        status: GuideStatus.APPROVED,
        verified: true,
        deletedAt: null,
      },
      select: { id: true, userId: true },
    });
    if (!guide) throw new BadRequestException('An approved verified guide must be assigned');
    if (roles.includes(Role.GUIDE) && guide.userId !== actorId) {
      throw new ForbiddenException('A guide may only create a safety plan for their own profile');
    }

    return this.prisma.$transaction(async (tx) => {
      const plan = await tx.safetyPlan.create({
        data: {
          routeId: route.id,
          createdById: actorId,
          guideProfileId: guide.id,
          title: dto.title,
          tripStartAt,
          tripEndAt,
          riskLevelSnapshot: route.riskLevel,
          itinerary: dto.itinerary as unknown as Prisma.InputJsonValue,
          emergencyContacts: dto.emergencyContacts as unknown as Prisma.InputJsonValue,
          communicationsPlan: dto.communicationsPlan,
          evacuationPlan: dto.evacuationPlan,
          medicalPlan: dto.medicalPlan,
          riskMitigations: dto.riskMitigations as Prisma.InputJsonValue,
          equipmentChecklist: dto.equipmentChecklist as Prisma.InputJsonValue,
          ...(dto.permitReferences
            ? { permitReferences: dto.permitReferences as Prisma.InputJsonValue }
            : {}),
        },
        include: safetyPlanInclude,
      });
      await this.appendAudit(tx, plan, actorId, SafetyPlanAuditAction.CREATED, null, SafetyPlanStatus.DRAFT);
      return tx.safetyPlan.findUniqueOrThrow({ where: { id: plan.id }, include: safetyPlanInclude });
    });
  }

  async listMine(actorId: string) {
    await this.expireDuePlans();
    return this.prisma.safetyPlan.findMany({
      where: {
        OR: [{ createdById: actorId }, { guideProfile: { userId: actorId } }],
      },
      orderBy: { createdAt: 'desc' },
      include: safetyPlanInclude,
    });
  }

  async get(actorId: string, roles: string[], id: string) {
    await this.expireDuePlans();
    const plan = await this.prisma.safetyPlan.findUnique({ where: { id }, include: safetyPlanInclude });
    if (!plan) throw new NotFoundException('Safety plan not found');
    if (
      !roles.includes(Role.ADMIN) &&
      plan.createdById !== actorId &&
      plan.guideProfile.user.id !== actorId
    ) {
      throw new ForbiddenException('Safety plan access denied');
    }
    return plan;
  }

  async update(actorId: string, id: string, dto: UpdateSafetyPlanDto) {
    const current = await this.prisma.safetyPlan.findFirst({
      where: { id, createdById: actorId },
      include: safetyPlanInclude,
    });
    if (!current) throw new NotFoundException('Safety plan not found');
    if (current.status !== SafetyPlanStatus.DRAFT) {
      throw new ConflictException('Only a draft safety plan can be edited');
    }
    const tripStartAt = dto.tripStartAt ? new Date(dto.tripStartAt) : current.tripStartAt;
    const tripEndAt = dto.tripEndAt ? new Date(dto.tripEndAt) : current.tripEndAt;
    this.assertTripWindow(tripStartAt, tripEndAt);
    if (dto.itinerary) {
      await this.assertItinerary(current.routeId, dto.itinerary.map((item) => item.nodeCode));
    }
    const content: Prisma.SafetyPlanUncheckedUpdateManyInput = {
      ...(dto.title === undefined ? {} : { title: dto.title }),
      ...(dto.itinerary === undefined
        ? {}
        : { itinerary: dto.itinerary as unknown as Prisma.InputJsonValue }),
      ...(dto.emergencyContacts === undefined
        ? {}
        : { emergencyContacts: dto.emergencyContacts as unknown as Prisma.InputJsonValue }),
      ...(dto.communicationsPlan === undefined ? {} : { communicationsPlan: dto.communicationsPlan }),
      ...(dto.evacuationPlan === undefined ? {} : { evacuationPlan: dto.evacuationPlan }),
      ...(dto.medicalPlan === undefined ? {} : { medicalPlan: dto.medicalPlan }),
      ...(dto.riskMitigations === undefined
        ? {}
        : { riskMitigations: dto.riskMitigations as Prisma.InputJsonValue }),
      ...(dto.equipmentChecklist === undefined
        ? {}
        : { equipmentChecklist: dto.equipmentChecklist as Prisma.InputJsonValue }),
      ...(dto.permitReferences === undefined
        ? {}
        : { permitReferences: dto.permitReferences as Prisma.InputJsonValue }),
    };
    return this.prisma.$transaction(async (tx) => {
      const changed = await tx.safetyPlan.updateMany({
        where: { id, createdById: actorId, status: SafetyPlanStatus.DRAFT, version: current.version },
        data: {
          ...content,
          ...(dto.tripStartAt ? { tripStartAt } : {}),
          ...(dto.tripEndAt ? { tripEndAt } : {}),
          version: { increment: 1 },
        },
      });
      if (changed.count !== 1) throw new ConflictException('Safety plan was changed by another request');
      const plan = await tx.safetyPlan.findUniqueOrThrow({ where: { id }, include: safetyPlanInclude });
      await this.appendAudit(tx, plan, actorId, SafetyPlanAuditAction.UPDATED, SafetyPlanStatus.DRAFT, SafetyPlanStatus.DRAFT);
      return tx.safetyPlan.findUniqueOrThrow({ where: { id }, include: safetyPlanInclude });
    });
  }

  async submit(actorId: string, id: string) {
    const current = await this.prisma.safetyPlan.findFirst({
      where: { id, createdById: actorId },
      include: safetyPlanInclude,
    });
    if (!current) throw new NotFoundException('Safety plan not found');
    if (current.status !== SafetyPlanStatus.DRAFT) {
      throw new ConflictException('Only a draft safety plan can be submitted');
    }
    this.assertTripWindow(current.tripStartAt, current.tripEndAt);
    const now = new Date();
    return this.transition(
      current,
      actorId,
      SafetyPlanAuditAction.SUBMITTED,
      SafetyPlanStatus.SUBMITTED,
      { submittedAt: now, version: { increment: 1 } },
    );
  }

  async reviewQueue() {
    await this.expireDuePlans();
    return this.prisma.safetyPlan.findMany({
      where: { status: SafetyPlanStatus.SUBMITTED },
      orderBy: [{ tripStartAt: 'asc' }, { submittedAt: 'asc' }],
      include: safetyPlanInclude,
    });
  }

  async review(adminId: string, id: string, dto: ReviewSafetyPlanDto) {
    const current = await this.prisma.safetyPlan.findUnique({ where: { id }, include: safetyPlanInclude });
    if (!current) throw new NotFoundException('Safety plan not found');
    if (current.status !== SafetyPlanStatus.SUBMITTED) {
      throw new ConflictException('Only a submitted safety plan can be reviewed');
    }
    if (dto.decision === SafetyPlanStatus.REJECTED && !dto.notes) {
      throw new BadRequestException('Rejection notes are required');
    }
    if (!current.route.active || current.route.riskLevel !== current.riskLevelSnapshot) {
      throw new BadRequestException('Route risk changed; the creator must submit a new safety plan');
    }
    if (dto.decision === SafetyPlanStatus.APPROVED && current.tripEndAt <= new Date()) {
      throw new BadRequestException('An expired trip cannot be approved');
    }
    const approved = dto.decision === SafetyPlanStatus.APPROVED;
    return this.transition(
      current,
      adminId,
      approved ? SafetyPlanAuditAction.APPROVED : SafetyPlanAuditAction.REJECTED,
      approved ? SafetyPlanStatus.APPROVED : SafetyPlanStatus.REJECTED,
      {
        reviewedById: adminId,
        reviewNotes: dto.notes ?? null,
        ...(approved
          ? { approvedAt: new Date(), expiresAt: current.tripEndAt }
          : { rejectedAt: new Date() }),
        version: { increment: 1 },
      },
    );
  }

  async revoke(adminId: string, id: string, dto: RevokeSafetyPlanDto) {
    const current = await this.prisma.safetyPlan.findUnique({ where: { id }, include: safetyPlanInclude });
    if (!current) throw new NotFoundException('Safety plan not found');
    if (current.status !== SafetyPlanStatus.APPROVED) {
      throw new ConflictException('Only an approved safety plan can be revoked');
    }
    return this.transition(
      current,
      adminId,
      SafetyPlanAuditAction.REVOKED,
      SafetyPlanStatus.REVOKED,
      {
        reviewedById: adminId,
        reviewNotes: dto.reason,
        revokedAt: new Date(),
        version: { increment: 1 },
      },
    );
  }

  async approvedForValidation(
    id: string | undefined,
    actorId: string | undefined,
    routeId: string,
    guideProfileId: string | undefined,
    travelStartAt: Date,
    now = new Date(),
    travelEndAt = travelStartAt,
  ) {
    if (!id || !actorId || !guideProfileId) return null;
    await this.expireDuePlans(now);
    const plan = await this.prisma.safetyPlan.findFirst({
      where: {
        id,
        routeId,
        guideProfileId,
        status: SafetyPlanStatus.APPROVED,
        approvedAt: { not: null },
        reviewedById: { not: null },
        reviewedBy: { roles: { has: Role.ADMIN } },
        expiresAt: { gt: now },
        tripStartAt: { lte: travelStartAt },
        tripEndAt: { gte: travelEndAt },
        OR: [{ createdById: actorId }, { guideProfile: { userId: actorId } }],
      },
      select: {
        id: true,
        status: true,
        approvedAt: true,
        expiresAt: true,
        reviewedById: true,
        auditEntries: {
          where: {
            action: SafetyPlanAuditAction.APPROVED,
            toStatus: SafetyPlanStatus.APPROVED,
            actorId: { not: null },
          },
          orderBy: { createdAt: 'desc' },
          select: { actorId: true },
        },
      },
    });
    if (!plan || !plan.reviewedById || !plan.auditEntries.some((audit) => audit.actorId === plan.reviewedById)) {
      return null;
    }
    const { auditEntries: _auditEntries, ...approval } = plan;
    return approval;
  }

  @Cron(CronExpression.EVERY_HOUR, { name: 'route-safety-plan-expiry' })
  async expireDuePlans(now = new Date()) {
    const due = await this.prisma.safetyPlan.findMany({
      where: { status: SafetyPlanStatus.APPROVED, expiresAt: { lte: now } },
      include: safetyPlanInclude,
    });
    for (const current of due) {
      await this.transition(
        current,
        null,
        SafetyPlanAuditAction.EXPIRED,
        SafetyPlanStatus.EXPIRED,
        { version: { increment: 1 } },
      );
    }
    return due.length;
  }

  private async transition(
    current: SafetyPlanRecord,
    actorId: string | null,
    action: SafetyPlanAuditAction,
    toStatus: SafetyPlanStatus,
    data: Prisma.SafetyPlanUncheckedUpdateManyInput,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const changed = await tx.safetyPlan.updateMany({
        where: { id: current.id, status: current.status, version: current.version },
        data: { ...data, status: toStatus },
      });
      if (changed.count !== 1) throw new ConflictException('Safety plan was changed by another request');
      const plan = await tx.safetyPlan.findUniqueOrThrow({
        where: { id: current.id },
        include: safetyPlanInclude,
      });
      await this.appendAudit(tx, plan, actorId, action, current.status, toStatus);
      return tx.safetyPlan.findUniqueOrThrow({ where: { id: current.id }, include: safetyPlanInclude });
    });
  }

  private async appendAudit(
    tx: Prisma.TransactionClient,
    plan: SafetyPlanSnapshotInput,
    actorId: string | null,
    action: SafetyPlanAuditAction,
    fromStatus: SafetyPlanStatus | null,
    toStatus: SafetyPlanStatus,
  ) {
    await tx.safetyPlanAudit.create({
      data: {
        safetyPlanId: plan.id,
        ...(actorId ? { actorId } : {}),
        action,
        fromStatus,
        toStatus,
        planVersion: plan.version,
        snapshot: this.snapshot(plan),
        reason: plan.reviewNotes,
      },
    });
  }

  private snapshot(plan: SafetyPlanSnapshotInput): Prisma.InputJsonObject {
    return {
      id: plan.id,
      routeId: plan.routeId,
      createdById: plan.createdById,
      guideProfileId: plan.guideProfileId,
      title: plan.title,
      tripStartAt: plan.tripStartAt.toISOString(),
      tripEndAt: plan.tripEndAt.toISOString(),
      riskLevelSnapshot: plan.riskLevelSnapshot,
      itinerary: plan.itinerary,
      emergencyContacts: plan.emergencyContacts,
      communicationsPlan: plan.communicationsPlan,
      evacuationPlan: plan.evacuationPlan,
      medicalPlan: plan.medicalPlan,
      riskMitigations: plan.riskMitigations,
      equipmentChecklist: plan.equipmentChecklist,
      permitReferences: plan.permitReferences ?? null,
      status: plan.status,
      version: plan.version,
      submittedAt: plan.submittedAt?.toISOString() ?? null,
      approvedAt: plan.approvedAt?.toISOString() ?? null,
      rejectedAt: plan.rejectedAt?.toISOString() ?? null,
      revokedAt: plan.revokedAt?.toISOString() ?? null,
      expiresAt: plan.expiresAt?.toISOString() ?? null,
      reviewedById: plan.reviewedById,
      reviewNotes: plan.reviewNotes,
    };
  }

  private async resolveRoute(reference: string) {
    const route = await this.prisma.researchRoute.findFirst({
      where: {
        active: true,
        OR: this.isUuid(reference) ? [{ id: reference }, { code: reference }] : [{ code: reference }],
      },
      select: { id: true, code: true, riskLevel: true },
    });
    if (!route) throw new NotFoundException('Research route not found');
    return route;
  }

  private async assertItinerary(routeId: string, nodeCodes: string[]) {
    const unique = [...new Set(nodeCodes)];
    const count = await this.prisma.routeNode.count({
      where: { routeId, code: { in: unique }, active: true },
    });
    if (count !== unique.length) throw new BadRequestException('Itinerary contains an unknown or inactive route node');
  }

  private assertTripWindow(start: Date, end: Date) {
    if (end <= start) throw new BadRequestException('tripEndAt must be after tripStartAt');
    if (end.getTime() - start.getTime() > 90 * 24 * 60 * 60 * 1000) {
      throw new BadRequestException('Safety plans may cover at most 90 days');
    }
    if (end <= new Date()) throw new BadRequestException('Trip end must be in the future');
  }

  private riskValue(risk: RouteRiskLevel) {
    return Number(risk.slice(1));
  }

  private isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }
}
