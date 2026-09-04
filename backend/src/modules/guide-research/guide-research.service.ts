import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BookingStatus,
  CefrLevel,
  GuideCompetencyStatus,
  GuideCompetencyType,
  GuideStatus,
  Prisma,
  RouteFamily,
  RouteRiskLevel,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ROUTE_GRAPH } from '../route-planning/route-graph.data.js';
import { MatchGuidesDto, ScoreCompetencyDto } from './dto/score-competency.dto.js';

const ACTIVE_BOOKING_STATUSES = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.IN_PROGRESS,
];
const VERIFIED_COMPETENCY_STATUSES = [
  GuideCompetencyStatus.HUMAN_VERIFIED,
  GuideCompetencyStatus.DOCUMENT_VERIFIED,
];
const ROUTE_FAMILY_BY_CODE: Record<string, RouteFamily> = {
  'central-heritage': RouteFamily.CENTRAL_HERITAGE,
  gobi: RouteFamily.GOBI,
  khuvsgul: RouteFamily.KHUVSGUL,
  'western-altai': RouteFamily.WESTERN_ALTAI,
};

interface MatchingRoute {
  databaseId?: string;
  id: string;
  name: string;
  routeFamily: RouteFamily;
  riskClass: RouteRiskLevel;
  guideRequirements: {
    minimumLanguageLevel: CefrLevel | string;
    routeBadge: string;
    firstAidRequired: boolean;
    legalRole: string;
    specialtySkills: string[];
  };
}

@Injectable()
export class GuideResearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService = new ConfigService(),
  ) {}

  score(dto: ScoreCompetencyDto) {
    const p = dto.performance;
    const k = dto.knowledge;
    const performance = {
      communication: p.communication * 0.10,
      groupSafety: p.groupSafety * 0.10,
      explanationStructure: p.explanationStructure * 0.10,
      factualPresentation: p.factualPresentation * 0.08,
      touristCare: p.touristCare * 0.05,
      questionHandling: p.questionHandling * 0.04,
      professionalism: p.professionalism * 0.03,
    };
    const knowledge = {
      historyArchaeology: k.historyArchaeology * 0.15,
      religionCulture: k.religionCulture * 0.125,
      geographyNature: k.geographyNature * 0.125,
      lawEthics: k.lawEthics * 0.05,
      societyEconomy: k.societyEconomy * 0.05,
    };
    const performanceScore = this.sum(performance);
    const knowledgeScore = this.sum(knowledge);
    const total = performanceScore + knowledgeScore;
    return {
      rubricVersion: 'guide-competency-2026-v1',
      label: 'AI pre-screen; not an official certification',
      performanceScore: this.round(performanceScore),
      knowledgeScore: this.round(knowledgeScore),
      totalScore: this.round(total),
      passedSkillGate: performanceScore >= 30,
      preScreenPassed: performanceScore >= 30 && total >= 70,
      confidence: dto.confidence ?? 0.5,
      breakdown: { performance, knowledge },
    };
  }

  async match(dto: MatchGuidesDto, userId?: string) {
    const route = await this.resolveRoute(dto.routeId);
    const routeFamily = route.routeFamily;
    const interval = this.requestedInterval(dto);
    const now = new Date();
    const language = dto.language.trim().toLowerCase();
    const weights = this.weights();

    const guides = await this.prisma.guideProfile.findMany({
        where: { status: GuideStatus.APPROVED, verified: true, deletedAt: null },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              ...(interval
                ? {
                    guidedBookings: {
                      where: {
                        deletedAt: null,
                        status: { in: ACTIVE_BOOKING_STATUSES },
                        startsAt: { lt: interval.endsAt },
                        endsAt: { gt: interval.startsAt },
                      },
                      select: { id: true },
                      take: 1,
                    },
                  }
                : {}),
            },
          },
          evidence: {
            where: {
              status: 'VERIFIED',
              AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }],
            },
            select: { type: true, expiresAt: true },
          },
          languageAssessments: {
            where: {
              language,
              assessmentStatus: { in: VERIFIED_COMPETENCY_STATUSES },
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              humanVerifiedCefr: true,
              aiEstimatedCefr: true,
              assessmentStatus: true,
            },
          },
          routeCompetencies: {
            where: {
              routeFamily,
              status: { in: VERIFIED_COMPETENCY_STATUSES },
              AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }],
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { score: true, status: true, expiresAt: true },
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
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              certificateStatus: true,
              practicalVerificationStatus: true,
              expiresAt: true,
            },
          },
          competencies: {
            where: {
              status: { in: VERIFIED_COMPETENCY_STATUSES },
              competencyType: {
                in: [
                  GuideCompetencyType.GENERAL_KNOWLEDGE,
                  GuideCompetencyType.GUIDE_SKILL,
                  GuideCompetencyType.SPECIALTY,
                ],
              },
              AND: [{ OR: [{ validTo: null }, { validTo: { gt: now } }] }],
            },
            select: { competencyType: true, competencyCode: true, score: true, status: true },
          },
        },
      });

    // A caller may request a stricter language level, but can never weaken the
    // authoritative route requirement maintained by an administrator.
    const effectiveMinimumLanguage = this.stricterLanguageLevel(
      route.guideRequirements.minimumLanguageLevel,
      dto.minimumLanguageLevel,
    );
    const minimum = this.languageValue(effectiveMinimumLanguage);
    const evaluated = guides.map((guide) => {
      const languageAssessment = guide.languageAssessments[0];
      const assessedLevel = languageAssessment?.humanVerifiedCefr ?? null;
      const routeCompetency = guide.routeCompetencies[0];
      const activeFirstAid = guide.firstAidRecords.length > 0 ||
        guide.evidence.some((evidence) => evidence.type === 'FIRST_AID');
      const availabilityConflicts = interval
        ? ('guidedBookings' in guide.user ? guide.user.guidedBookings.length : 0)
        : 0;
      const specialtyCompetencies = new Set(
        guide.competencies
          .filter((item) => item.competencyType === GuideCompetencyType.SPECIALTY)
          .map((item) => item.competencyCode),
      );
      const failures: string[] = [];
      if (!assessedLevel || this.languageValue(assessedLevel) < minimum) failures.push('LANGUAGE');
      if (guide.legalRole !== route.guideRequirements.legalRole) failures.push('LEGAL_ROLE');
      if (!routeCompetency) failures.push('ROUTE_COMPETENCY');
      if (route.guideRequirements.firstAidRequired && !activeFirstAid) failures.push('FIRST_AID');
      if (availabilityConflicts > 0) failures.push('AVAILABILITY');
      for (const skill of route.guideRequirements.specialtySkills) {
        if (!specialtyCompetencies.has(skill)) failures.push(`SPECIALTY:${skill}`);
      }

      const languageFit = assessedLevel
        ? Math.min(100, this.languageValue(assessedLevel) * 16.67)
        : 0;
      const routeExpertise = routeCompetency ? Number(routeCompetency.score) : 0;
      const generalScores = guide.competencies
        .filter((item) => item.competencyType !== GuideCompetencyType.SPECIALTY)
        .map((item) => Number(item.score));
      const competency = generalScores.length
        ? generalScores.reduce((total, value) => total + value, 0) / generalScores.length
        : 0;
      const safety = activeFirstAid ? 100 : 0;
      const reliability = Math.max(
        0,
        Math.min(100, Number(guide.rating) * 20 - guide.providerCancellationCount * 5),
      );
      const factors = {
        languageFit: this.round(languageFit),
        routeExpertise: this.round(routeExpertise),
        competency: this.round(competency),
        experience: Math.min(100, guide.experienceYears * 10),
        safety,
        reliability: this.round(reliability),
      };
      const score = factors.languageFit * weights.language +
        factors.routeExpertise * weights.route +
        factors.competency * weights.competency +
        factors.experience * weights.experience +
        factors.safety * weights.firstAid +
        factors.reliability * weights.rating;
      const publicGuide = {
        id: guide.id,
        userId: guide.userId,
        name: guide.user.name,
        avatarUrl: guide.user.avatarUrl,
        city: guide.city,
        country: guide.country,
        rating: Number(guide.rating),
        reviewCount: guide.reviewCount,
        experienceYears: guide.experienceYears,
        languageAssessment: languageAssessment
          ? { language, level: assessedLevel, status: languageAssessment.assessmentStatus }
          : null,
        routeCompetency: routeCompetency
          ? { routeFamily, score: Number(routeCompetency.score), status: routeCompetency.status }
          : null,
        legalRole: guide.legalRole,
      };
      const reasons = [
        ...(assessedLevel ? [`${language.toUpperCase()} ${assessedLevel} (${languageAssessment.assessmentStatus})`] : []),
        ...(routeCompetency ? [`${route.name} competency ${routeCompetency.status.toLowerCase()}`] : []),
        ...(activeFirstAid ? ['First-aid evidence verified and current'] : []),
        ...(interval && availabilityConflicts === 0 ? ['Available for requested dates'] : []),
      ];
      return {
        guideId: guide.id,
        publicGuide,
        eligible: failures.length === 0,
        hardGateFailures: failures,
        score: this.round(score),
        factors,
        reasons,
      };
    });

    const eligible = evaluated
      .filter((item) => item.eligible)
      .sort((left, right) => right.score - left.score)
      .slice(0, dto.limit ?? 10);
    const rankByGuide = new Map(eligible.map((item, index) => [item.guideId, index + 1]));
    const run = await this.prisma.$transaction(async (tx) => {
      const created = await tx.guideMatchRun.create({
        data: {
          userId,
          routeId: route.databaseId,
          routeFamily,
          requestedStartAt: interval?.startsAt,
          requestedEndAt: interval?.endsAt,
          language,
          minimumCefr: effectiveMinimumLanguage as CefrLevel,
          requirements: {
            riskClass: route.riskClass,
            legalRole: route.guideRequirements.legalRole,
            firstAidRequired: route.guideRequirements.firstAidRequired,
            specialtySkills: route.guideRequirements.specialtySkills,
          },
          weights,
        },
        select: { id: true },
      });
      if (evaluated.length) {
        await tx.guideMatchResult.createMany({
          data: evaluated.map((item) => ({
            guideMatchRunId: created.id,
            guideProfileId: item.guideId,
            eligible: item.eligible,
            score: item.score,
            rank: rankByGuide.get(item.guideId),
            hardGateFailures: item.hardGateFailures,
            factors: item.factors,
            reasons: item.reasons,
          })),
        });
      }
      return created;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });

    return {
      matchRunId: run.id,
      routeId: route.id,
      requestedDates: interval
        ? { startsAt: interval.startsAt, endsAt: interval.endsAt }
        : null,
      policy: 'Verified, current hard eligibility gates are applied before weighted ranking.',
      eligible,
      rejected: evaluated
        .filter((item) => !item.eligible)
        .map((item) => ({
          guideId: item.guideId,
          name: item.publicGuide.name,
          hardGateFailures: item.hardGateFailures,
        })),
    };
  }

  private async resolveRoute(reference: string): Promise<MatchingRoute> {
    const databaseRoute = await this.prisma.researchRoute.findFirst({
      where: {
        active: true,
        OR: this.isUuid(reference) ? [{ id: reference }, { code: reference }] : [{ code: reference }],
      },
      select: {
        id: true,
        code: true,
        name: true,
        routeFamily: true,
        riskLevel: true,
        minimumLanguageLevel: true,
        routeBadge: true,
        firstAidRequired: true,
        requiredGuideLegalRole: true,
        requiredSpecialtySkills: true,
      },
    });
    if (databaseRoute) {
      return {
        databaseId: databaseRoute.id,
        id: databaseRoute.code,
        name: databaseRoute.name,
        routeFamily: databaseRoute.routeFamily,
        riskClass: databaseRoute.riskLevel,
        guideRequirements: {
          minimumLanguageLevel: databaseRoute.minimumLanguageLevel,
          routeBadge: databaseRoute.routeBadge,
          firstAidRequired: databaseRoute.firstAidRequired,
          legalRole: databaseRoute.requiredGuideLegalRole,
          specialtySkills: databaseRoute.requiredSpecialtySkills,
        },
      };
    }

    if (this.config.get<boolean>('ROUTE_GRAPH_ALLOW_STATIC_FALLBACK', false)) {
      const fixture = ROUTE_GRAPH.routes.find((item) => item.id === reference);
      const routeFamily = fixture && ROUTE_FAMILY_BY_CODE[fixture.id];
      if (fixture && routeFamily) return { ...fixture, routeFamily };
    }
    throw new NotFoundException('Research route not found');
  }

  private requestedInterval(dto: MatchGuidesDto) {
    if (!dto.requestedStartAt && !dto.requestedEndAt) return null;
    if (!dto.requestedStartAt || !dto.requestedEndAt) {
      throw new BadRequestException('Both requestedStartAt and requestedEndAt are required');
    }
    const startsAt = new Date(dto.requestedStartAt);
    const endsAt = new Date(dto.requestedEndAt);
    if (startsAt <= new Date() || endsAt <= startsAt) {
      throw new BadRequestException('Requested guide matching dates are invalid');
    }
    return { startsAt, endsAt };
  }

  private languageValue(value: string) {
    return ({ A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 })[
      String(value).toUpperCase()
    ] ?? 0;
  }

  private stricterLanguageLevel(routeMinimum: string, requestedMinimum: string) {
    return this.languageValue(requestedMinimum) > this.languageValue(routeMinimum)
      ? requestedMinimum.toUpperCase()
      : routeMinimum.toUpperCase();
  }

  private isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  private sum(values: Record<string, number>) {
    return Object.values(values).reduce((total, value) => total + value, 0);
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }

  private weights() {
    const raw = {
      language: this.config.get<number>('GUIDE_MATCH_LANGUAGE_WEIGHT', 25),
      route: this.config.get<number>('GUIDE_MATCH_ROUTE_WEIGHT', 25),
      competency: this.config.get<number>('GUIDE_MATCH_COMPETENCY_WEIGHT', 20),
      experience: this.config.get<number>('GUIDE_MATCH_EXPERIENCE_WEIGHT', 10),
      firstAid: this.config.get<number>('GUIDE_MATCH_FIRST_AID_WEIGHT', 10),
      rating: this.config.get<number>('GUIDE_MATCH_RATING_WEIGHT', 10),
    };
    const total = Object.values(raw).reduce((sum, value) => sum + value, 0) || 100;
    return Object.fromEntries(
      Object.entries(raw).map(([key, value]) => [key, value / total]),
    ) as typeof raw;
  }
}
