import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import {
  GuideCompetencyStatus,
  GuideCompetencyType,
  GuideStatus,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ValidateItineraryDto } from './dto/validate-itinerary.dto.js';
import { ROUTE_GRAPH } from './route-graph.data.js';
import { RouteGraphRepository, ROUTE_RESEARCH_DISCLAIMER } from './route-graph.repository.js';
import { RouteRiskPolicyService } from './route-risk-policy.service.js';
import { SafetyPlanService } from './safety-plan.service.js';
import { HydratedResearchRoute, ResearchRoute, RiskClass, RouteEdge } from './route.types.js';

export type ValidationIssueCode =
  | 'UNKNOWN_ROUTE_NODE' | 'ROUTE_EDGE_MISSING' | 'ROUTE_ORDER_INVALID' | 'POI_DISCONNECTED'
  | 'TRAVEL_TIME_IMPOSSIBLE' | 'DAILY_TIME_EXCEEDED' | 'TRIP_LENGTH_EXCEEDED' | 'TIME_BUDGET_EXCEEDED'
  | 'SEASON_INCOMPATIBLE' | 'SEASON_CLOSED_ALL_DAYS' | 'TRANSPORT_INCOMPATIBLE' | 'TRANSPORT_UNAVAILABLE'
  | 'BUDGET_EXCEEDED' | 'BUDGET_INSUFFICIENT' | 'ACCESS_RESTRICTED' | 'PERMIT_REQUIRED'
  | 'GUIDE_REQUIRED' | 'GUIDE_COMPETENCY_MISSING' | 'FIRST_AID_REQUIREMENT_NOT_MET'
  | 'SAFETY_CONSTRAINT_FAILED' | 'SOURCE_UNVERIFIED' | 'SOURCE_STALE';

/** Plan section 7.3 deterministic validator rules. `UNSOLVABLE` is the explicit
 * "this request cannot be satisfied" declaration required so an infeasible case
 * is reported rather than repaired or answered with an invented itinerary. */
export type ValidationRule =
  | 'ROUTE_CONNECTIVITY' | 'TIME_FEASIBILITY' | 'SEASON_ACCESS' | 'TRANSPORT' | 'BUDGET'
  | 'GUIDE_ELIGIBILITY' | 'RISK_ESCALATION' | 'SOURCE_PROVENANCE' | 'SOURCE_FRESHNESS' | 'UNSOLVABLE';

export interface ValidationIssue {
  code: ValidationIssueCode;
  rule: ValidationRule;
  severity: 'ERROR' | 'WARNING';
  message: string;
  context?: Record<string, unknown>;
}

/** How a failed itinerary should be handled next. Only `REPAIRABLE` justifies a
 * repair round; `UNSOLVABLE` must be reported to the traveler as impossible. */
export type FeasibilityStatus = 'FEASIBLE' | 'REPAIRABLE' | 'REQUIRES_EXTERNAL_APPROVAL' | 'UNSOLVABLE';

export interface FeasibilityVerdict {
  status: FeasibilityStatus;
  unsolvable: boolean;
  repairable: boolean;
  /** Blocking issues no re-ordering or re-scheduling of this stop set can clear. */
  reasons: ValidationIssue[];
}

type ApprovedSafetyPlan = {
  id: string;
  status: string;
  approvedAt: Date | null;
  expiresAt: Date | null;
  reviewedById: string | null;
} | null;

@Injectable()
export class RoutePlanningService {
  private readonly fallbackRiskPolicy = new RouteRiskPolicyService();

  constructor(
    @Optional() private readonly riskPolicy?: RouteRiskPolicyService,
    @Optional() private readonly prisma?: PrismaService,
    @Optional() private readonly graph?: RouteGraphRepository,
    @Optional() private readonly safetyPlans?: SafetyPlanService,
  ) {}

  listRoutes() {
    if (this.graph) return this.graph.list();
    return ROUTE_GRAPH.routes.map((route) => this.fixtureRoute(route.id));
  }

  getRoute(id: string) {
    if (this.graph) return this.graph.find(id);
    return this.fixtureRoute(id);
  }

  /** Compatibility-only deterministic facade for isolated evaluation tests.
   * Authenticated HTTP validation always calls validateAuthoritative and loads
   * the route, nodes, edges, sources, and guide requirements from PostgreSQL. */
  validate(dto: ValidateItineraryDto, now = new Date()) {
    return this.validateAgainstRoute(this.fixtureRoute(dto.routeId), dto, now, null, false);
  }

  /** Client-authored guide and approval claims are discarded. Eligibility and
   * R3/R4 approval are reconstructed from dedicated, current database records. */
  async validateAuthoritative(dto: ValidateItineraryDto, now = new Date(), actorId?: string) {
    const route = this.graph ? await this.graph.find(dto.routeId) : this.fixtureRoute(dto.routeId);
    const withoutClaims: ValidateItineraryDto = {
      ...dto,
      guide: undefined,
      safetyPlanProvided: false,
      humanApprovalProvided: false,
    };

    let guide: ValidateItineraryDto['guide'];
    if (dto.guideProfileId && this.prisma) {
      const verified = [
        GuideCompetencyStatus.HUMAN_VERIFIED,
        GuideCompetencyStatus.DOCUMENT_VERIFIED,
      ];
      const profile = await this.prisma.guideProfile.findFirst({
        where: {
          id: dto.guideProfileId,
          status: GuideStatus.APPROVED,
          verified: true,
          deletedAt: null,
        },
        select: {
          legalRole: true,
          languageAssessments: {
            where: {
              language: (dto.guideLanguage ?? 'en').toLowerCase(),
              assessmentStatus: { in: verified },
              humanVerifiedCefr: { not: null },
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { humanVerifiedCefr: true },
          },
          routeCompetencies: {
            where: {
              routeFamily: route.routeFamily,
              status: { in: verified },
              AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }],
            },
            take: 1,
            select: { id: true },
          },
          firstAidRecords: {
            where: {
              AND: [
                {
                  OR: [
                    { certificateStatus: 'DOCUMENT_VERIFIED' },
                    { practicalVerificationStatus: 'VERIFIED' },
                  ],
                },
                { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
              ],
            },
            take: 1,
            select: { id: true },
          },
          competencies: {
            where: {
              competencyType: GuideCompetencyType.SPECIALTY,
              status: { in: verified },
              AND: [{ OR: [{ validTo: null }, { validTo: { gt: now } }] }],
            },
            select: { competencyCode: true },
          },
        },
      });
      if (profile) {
        guide = {
          languageLevel: profile.languageAssessments[0]?.humanVerifiedCefr ?? '',
          routeBadges: profile.routeCompetencies.length ? [route.guideRequirements.routeBadge] : [],
          specialtySkills: profile.competencies.map((item) => item.competencyCode),
          firstAidVerified: profile.firstAidRecords.length > 0,
          legalRole: profile.legalRole,
        };
      }
    }

    const highestRisk = this.highestDeclaredRisk(route);
    const policy = (this.riskPolicy ?? this.fallbackRiskPolicy).for(highestRisk);
    const travelStartAt = new Date(dto.startDate);
    const travelEndAt = new Date(travelStartAt);
    travelEndAt.setUTCDate(
      travelStartAt.getUTCDate() + Math.max(...dto.stops.map((stop) => stop.day)) - 1,
    );
    const approvedSafetyPlan = policy.safetyPlanRequired && this.safetyPlans
      ? await this.safetyPlans.approvedForValidation(
          dto.safetyPlanId,
          actorId,
          route.databaseId,
          dto.guideProfileId,
          travelStartAt,
          now,
          travelEndAt,
        )
      : null;

    return this.validateAgainstRoute(
      route,
      {
        ...withoutClaims,
        guide,
        safetyPlanProvided: Boolean(approvedSafetyPlan),
        humanApprovalProvided: Boolean(approvedSafetyPlan),
      },
      now,
      approvedSafetyPlan,
      true,
    );
  }

  private validateAgainstRoute(
    route: HydratedResearchRoute,
    dto: ValidateItineraryDto,
    now: Date,
    approvedSafetyPlan: ApprovedSafetyPlan,
    requireVerifiedSources: boolean,
  ) {
    const issues: ValidationIssue[] = [];
    const start = new Date(dto.startDate);
    const dailyMinutes = new Map<number, number>();
    let distanceKm = 0;
    let travelMinutes = 0;
    let estimatedCostMinor = 0;
    const relevantSourceIds = new Set<string>();
    const requiredEdges: RouteEdge[] = [];
    const unresolvedLinks: Array<{ from: string; to: string }> = [];
    let activityMinutes = 0;
    if (route.sourceId) relevantSourceIds.add(route.sourceId);
    // A partial itinerary or client claim can never downgrade this hard gate.
    let highestRisk: RiskClass = this.highestDeclaredRisk(route);

    for (const stop of dto.stops) {
      if (!route.poiIds.includes(stop.poiId)) {
        issues.push({ code: 'UNKNOWN_ROUTE_NODE', rule: 'ROUTE_CONNECTIVITY', severity: 'ERROR', message: `${stop.poiId} is not part of ${route.name}.` });
      }
      const poi = route.pois.find((item) => item.id === stop.poiId);
      if (poi?.sourceId) relevantSourceIds.add(poi.sourceId);
      dailyMinutes.set(stop.day, (dailyMinutes.get(stop.day) ?? 0) + stop.activityMinutes);
      activityMinutes += stop.activityMinutes;
    }

    for (let index = 0; index < dto.stops.length - 1; index += 1) {
      const from = dto.stops[index];
      const to = dto.stops[index + 1];
      if (to.day < from.day) {
        issues.push({ code: 'ROUTE_ORDER_INVALID', rule: 'ROUTE_CONNECTIVITY', severity: 'ERROR', message: `Stop day ${to.day} cannot come after day ${from.day} in itinerary order.` });
      }
      const edge = this.findEdge(route, from.poiId, to.poiId);
      if (!edge) {
        issues.push({ code: 'ROUTE_EDGE_MISSING', rule: 'ROUTE_CONNECTIVITY', severity: 'ERROR', message: `No verified route edge connects ${from.poiId} and ${to.poiId}.` });
        unresolvedLinks.push({ from: from.poiId, to: to.poiId });
        continue;
      }
      requiredEdges.push(edge);
      relevantSourceIds.add(edge.sourceId);
      dailyMinutes.set(to.day, (dailyMinutes.get(to.day) ?? 0) + edge.nominalMinutes);
      distanceKm += edge.distanceKm;
      travelMinutes += edge.nominalMinutes;
      estimatedCostMinor += edge.estimatedCostMinor ?? 0;
      if (this.riskValue(edge.riskClass) > this.riskValue(highestRisk)) highestRisk = edge.riskClass;
      const travelDate = new Date(start);
      travelDate.setUTCDate(start.getUTCDate() + to.day - 1);
      const month = travelDate.getUTCMonth() + 1;
      if (!edge.openMonths.includes(month)) {
        issues.push({ code: 'SEASON_INCOMPATIBLE', rule: 'SEASON_ACCESS', severity: 'ERROR', message: `${edge.id} has no verified access season for month ${month}.`, context: { openMonths: edge.openMonths } });
      }
      if (dto.transportation && dto.transportation !== 'ANY' && dto.transportation !== edge.mode) {
        issues.push({ code: 'TRANSPORT_INCOMPATIBLE', rule: 'TRANSPORT', severity: 'ERROR', message: `${edge.id} requires ${edge.mode}; requested transport is ${dto.transportation}.` });
      }
      if ((edge.requiresPermitCheck ?? edge.mode !== 'ROAD') && !dto.permitConfirmed) {
        issues.push({ code: 'PERMIT_REQUIRED', rule: 'SEASON_ACCESS', severity: 'ERROR', message: `${edge.id} requires a current permit/access confirmation before use.` });
      }
      if (this.riskValue(edge.riskClass) >= 2 || edge.requiresRoadCheck || edge.requiresWeatherCheck) {
        issues.push({ code: 'ACCESS_RESTRICTED', rule: 'SEASON_ACCESS', severity: 'WARNING', message: `${edge.id} road, weather and access status must be re-verified for the travel date.` });
      }
    }

    const maxDaily = dto.maxDailyMinutes ?? 720;
    for (const [day, minutes] of dailyMinutes) {
      if (minutes > maxDaily) {
        issues.push({ code: minutes > 1440 ? 'TRAVEL_TIME_IMPOSSIBLE' : 'DAILY_TIME_EXCEEDED', rule: 'TIME_FEASIBILITY', severity: 'ERROR', message: `Day ${day} requires ${minutes} minutes, above the ${maxDaily}-minute limit.`, context: { day, minutes, maxDailyMinutes: maxDaily, excessMinutes: minutes - maxDaily } });
      }
    }
    // Spreading stops over more days is the usual time repair, so the requested
    // trip length has to be a checked constraint. Without it a "repaired" plan
    // can silently return a longer trip than the traveler asked for.
    const plannedDays = Math.max(...dto.stops.map((stop) => stop.day));
    if (dto.maxDays !== undefined && plannedDays > dto.maxDays) {
      issues.push({ code: 'TRIP_LENGTH_EXCEEDED', rule: 'TIME_FEASIBILITY', severity: 'ERROR', message: `Itinerary spans ${plannedDays} days, above the requested ${dto.maxDays}-day limit.`, context: { plannedDays, maxDays: dto.maxDays } });
    }
    if (dto.budgetMinor !== undefined && estimatedCostMinor > dto.budgetMinor) {
      issues.push({ code: 'BUDGET_EXCEEDED', rule: 'BUDGET', severity: 'ERROR', message: `Estimated transport cost ${estimatedCostMinor} exceeds budget ${dto.budgetMinor}.` });
    }

    const policy = (this.riskPolicy ?? this.fallbackRiskPolicy).for(highestRisk);
    if (policy.guideRequired) this.validateGuide(route.guideRequirements, dto, issues);
    if (policy.safetyPlanRequired && !dto.safetyPlanProvided) {
      issues.push({ code: 'SAFETY_CONSTRAINT_FAILED', rule: 'RISK_ESCALATION', severity: 'ERROR', message: `${highestRisk} travel requires a current, admin-approved safety and evacuation plan.` });
    }
    if (policy.humanApprovalRequired && !dto.humanApprovalProvided) {
      issues.push({ code: 'SAFETY_CONSTRAINT_FAILED', rule: 'RISK_ESCALATION', severity: 'ERROR', message: 'R4 travel requires explicit human approval recorded in the safety-plan audit trail.' });
    }

    const staleBefore = new Date(now);
    staleBefore.setUTCFullYear(staleBefore.getUTCFullYear() - 1);
    const sourcesById = new Map(route.sources.map((source) => [source.id, source]));
    if (requireVerifiedSources) {
      for (const sourceId of relevantSourceIds) {
        const source = sourcesById.get(sourceId);
        if (
          !source ||
          source.verificationStatus !== 'HUMAN_VERIFIED' ||
          !source.licenseOrUsageNote?.trim()
        ) {
          issues.push({
            code: 'SOURCE_UNVERIFIED',
            rule: 'SOURCE_PROVENANCE',
            severity: 'ERROR',
            message: `${source?.title ?? sourceId} requires an explicit human source and reuse-rights review before authoritative validation.`,
            context: { sourceId },
          });
        }
      }
    }
    for (const source of route.sources.filter((item) => relevantSourceIds.has(item.id))) {
      if (new Date(source.lastVerifiedAt) < staleBefore) {
        issues.push({ code: 'SOURCE_STALE', rule: 'SOURCE_FRESHNESS', severity: 'WARNING', message: `${source.title} must be re-verified before booking.` });
      }
    }

    const valid = !issues.some((issue) => issue.severity === 'ERROR');
    const feasibility = this.assessFeasibility({
      valid,
      issues,
      route,
      dto,
      start,
      maxDaily,
      plannedDays,
      activityMinutes,
      travelMinutes,
      estimatedCostMinor,
      requiredEdges,
      unresolvedLinks,
    });
    issues.push(...feasibility.reasons);
    return {
      valid,
      routeId: route.id,
      routeDatabaseId: route.databaseId,
      summary: {
        distanceKm,
        travelMinutes,
        estimatedCostMinor,
        highestRisk,
        days: plannedDays,
      },
      feasibility,
      issues,
      violations: issues,
      safetyApproval: {
        required: policy.safetyPlanRequired,
        humanApprovalRequired: policy.humanApprovalRequired,
        approved: Boolean(approvedSafetyPlan),
        safetyPlanId: approvedSafetyPlan?.id ?? null,
        approvedAt: approvedSafetyPlan?.approvedAt?.toISOString() ?? null,
        expiresAt: approvedSafetyPlan?.expiresAt?.toISOString() ?? null,
      },
      disclaimer: route.disclaimer,
      validationScope: 'RESEARCH_PREFLIGHT_NOT_A_BOOKING_OR_SAFETY_CLEARANCE',
      authoritativeForBooking: false,
      validatedAt: now.toISOString(),
    };
  }

  /** Deterministic plan section 7.3 `UNSOLVABLE` rule.
   *
   * A blocking issue is only "repairable" when re-ordering or re-scheduling the
   * same stop set could clear it. Anything fixed by the route data itself -- a
   * closed season, a mode-locked edge, an irreducible cost or time floor, an
   * isolated node -- stays broken however the days are shuffled, so the request
   * is declared impossible instead of sent through a pointless repair round.
   * Guide and safety gates are reported separately: they are not impossible,
   * they need an eligible guide or a recorded human approval. */
  private assessFeasibility(input: {
    valid: boolean;
    issues: ValidationIssue[];
    route: HydratedResearchRoute;
    dto: ValidateItineraryDto;
    start: Date;
    maxDaily: number;
    plannedDays: number;
    activityMinutes: number;
    travelMinutes: number;
    estimatedCostMinor: number;
    requiredEdges: RouteEdge[];
    unresolvedLinks: Array<{ from: string; to: string }>;
  }): FeasibilityVerdict {
    const { dto, route, requiredEdges } = input;
    const reasons: ValidationIssue[] = [];
    const add = (code: ValidationIssueCode, message: string, context?: Record<string, unknown>) =>
      reasons.push({ code, rule: 'UNSOLVABLE', severity: 'ERROR', message, context });

    // The day budget is a floor: every stop's activity time plus every required
    // travel leg has to fit, no matter how the stops are distributed.
    const dayBudget = dto.maxDays ?? input.plannedDays;
    const requiredMinutes = input.activityMinutes + input.travelMinutes;
    const availableMinutes = dayBudget * input.maxDaily;
    if (requiredMinutes > availableMinutes) {
      add('TIME_BUDGET_EXCEEDED', `The stops need ${requiredMinutes} minutes of activity and travel, above the ${availableMinutes} minutes available in ${dayBudget} day(s) at ${input.maxDaily} minutes per day.`, { requiredMinutes, availableMinutes, dayBudget, maxDailyMinutes: input.maxDaily });
    }

    // A single leg longer than one day's limit cannot be split across days.
    for (const edge of requiredEdges) {
      if (edge.nominalMinutes > input.maxDaily) {
        add('TIME_BUDGET_EXCEEDED', `${edge.id} alone needs ${edge.nominalMinutes} minutes, above the ${input.maxDaily}-minute daily limit.`, { edgeId: edge.id, nominalMinutes: edge.nominalMinutes });
      }
    }

    // Transport mode is a property of the edge, so no schedule change supplies
    // a different one unless a parallel edge already exists in the RouteGraph.
    const requested = dto.transportation;
    if (requested && requested !== 'ANY') {
      for (const edge of requiredEdges) {
        if (edge.mode === requested) continue;
        const alternative = route.edges.some((candidate) =>
          candidate.mode === requested &&
          ((candidate.from === edge.from && candidate.to === edge.to) ||
            (candidate.bidirectional === true && candidate.from === edge.to && candidate.to === edge.from)),
        );
        if (!alternative) {
          add('TRANSPORT_UNAVAILABLE', `No ${requested} connection exists between ${edge.from} and ${edge.to}; the RouteGraph only records ${edge.mode}.`, { edgeId: edge.id, requested, available: edge.mode });
        }
      }
    }

    // Closed for every day the trip could occupy from this start date.
    const reachableMonths = new Set<number>();
    for (let offset = 0; offset < Math.max(dayBudget, input.plannedDays); offset += 1) {
      const day = new Date(input.start);
      day.setUTCDate(input.start.getUTCDate() + offset);
      reachableMonths.add(day.getUTCMonth() + 1);
    }
    for (const edge of requiredEdges) {
      if (![...reachableMonths].some((month) => edge.openMonths.includes(month))) {
        add('SEASON_CLOSED_ALL_DAYS', `${edge.id} is closed for every day of a ${dayBudget}-day trip starting ${dto.startDate}.`, { edgeId: edge.id, openMonths: edge.openMonths, reachableMonths: [...reachableMonths] });
      }
    }

    // The cost of connecting a fixed stop set is irreducible by re-ordering.
    if (dto.budgetMinor !== undefined && input.estimatedCostMinor > dto.budgetMinor) {
      add('BUDGET_INSUFFICIENT', `The cheapest recorded transport for these stops costs ${input.estimatedCostMinor}, above the ${dto.budgetMinor} budget.`, { estimatedCostMinor: input.estimatedCostMinor, budgetMinor: dto.budgetMinor });
    }

    // A node no edge touches can never be reached, in any order.
    for (const { from, to } of input.unresolvedLinks) {
      for (const poiId of [from, to]) {
        const connected = route.edges.some((edge) => edge.from === poiId || edge.to === poiId);
        if (!connected) {
          add('POI_DISCONNECTED', `${poiId} has no route edge in ${route.name}, so no itinerary order can reach it.`, { poiId });
        }
      }
    }

    const deduped = reasons.filter((reason, index) =>
      reasons.findIndex((other) => other.code === reason.code && other.message === reason.message) === index,
    );
    if (input.valid) return { status: 'FEASIBLE', unsolvable: false, repairable: false, reasons: [] };
    if (deduped.length) return { status: 'UNSOLVABLE', unsolvable: true, repairable: false, reasons: deduped };
    const externalOnly = input.issues
      .filter((issue) => issue.severity === 'ERROR')
      .every((issue) => issue.rule === 'GUIDE_ELIGIBILITY' || issue.rule === 'RISK_ESCALATION' || issue.rule === 'SOURCE_PROVENANCE');
    if (externalOnly) return { status: 'REQUIRES_EXTERNAL_APPROVAL', unsolvable: false, repairable: false, reasons: [] };
    return { status: 'REPAIRABLE', unsolvable: false, repairable: true, reasons: [] };
  }

  private fixtureRoute(id: string): HydratedResearchRoute {
    const route = ROUTE_GRAPH.routes.find((item) => item.id === id);
    if (!route) throw new NotFoundException('Research route not found');
    const poiIds = new Set(route.poiIds);
    const pois = ROUTE_GRAPH.pois.filter((poi) => poiIds.has(poi.id));
    const edges = ROUTE_GRAPH.edges.filter((edge) => poiIds.has(edge.from) && poiIds.has(edge.to));
    const sourceIds = new Set([...pois.map((poi) => poi.sourceId), ...edges.map((edge) => edge.sourceId)]);
    return {
      ...route,
      databaseId: route.id,
      routeFamily: ({
        'central-heritage': 'CENTRAL_HERITAGE',
        gobi: 'GOBI',
        khuvsgul: 'KHUVSGUL',
        'western-altai': 'WESTERN_ALTAI',
      } as Record<string, HydratedResearchRoute['routeFamily']>)[route.id],
      active: true,
      pois,
      edges,
      sources: ROUTE_GRAPH.sources.filter((source) => sourceIds.has(source.id)),
      disclaimer: ROUTE_RESEARCH_DISCLAIMER,
    };
  }

  private highestDeclaredRisk(route: HydratedResearchRoute): RiskClass {
    return route.edges.reduce(
      (highest, edge) => this.riskValue(edge.riskClass) > this.riskValue(highest) ? edge.riskClass : highest,
      route.riskClass,
    );
  }

  private findEdge(route: HydratedResearchRoute, from: string, to: string): RouteEdge | undefined {
    return route.edges.find((edge) =>
      (edge.from === from && edge.to === to) ||
      (edge.bidirectional === true && edge.from === to && edge.to === from),
    );
  }

  private validateGuide(
    requirements: ResearchRoute['guideRequirements'],
    dto: ValidateItineraryDto,
    issues: ValidationIssue[],
  ) {
    if (!dto.guide) {
      issues.push({ code: 'GUIDE_REQUIRED', rule: 'GUIDE_ELIGIBILITY', severity: 'ERROR', message: 'A verified eligible guide is required for this route risk level.' });
      return;
    }
    const level = (value: string) => ({ A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 })[value.toUpperCase()] ?? 0;
    const failures: string[] = [];
    if (level(dto.guide.languageLevel) < level(requirements.minimumLanguageLevel)) failures.push(`language ${requirements.minimumLanguageLevel}+`);
    if (!dto.guide.routeBadges.includes(requirements.routeBadge)) failures.push(`route badge ${requirements.routeBadge}`);
    if (requirements.firstAidRequired && !dto.guide.firstAidVerified) failures.push('verified first-aid evidence');
    if (dto.guide.legalRole !== requirements.legalRole) failures.push(`legal role ${requirements.legalRole}`);
    for (const skill of requirements.specialtySkills) {
      if (!dto.guide.specialtySkills.includes(skill)) failures.push(`skill ${skill}`);
    }
    if (failures.length) {
      const firstAidOnly = failures.every((failure) => failure.includes('first-aid'));
      issues.push({ code: firstAidOnly ? 'FIRST_AID_REQUIREMENT_NOT_MET' : 'GUIDE_COMPETENCY_MISSING', rule: 'GUIDE_ELIGIBILITY', severity: 'ERROR', message: `Guide is ineligible: missing ${failures.join(', ')}.` });
    }
  }

  private riskValue(risk: RiskClass) {
    return Number(risk.slice(1));
  }
}
