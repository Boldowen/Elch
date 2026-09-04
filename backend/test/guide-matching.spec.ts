import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { jest } from '@jest/globals';
import {
  CefrLevel,
  GuideLegalRole,
  RouteFamily,
  RouteRiskLevel,
} from '../src/generated/prisma/client.js';
import { GuideResearchService } from '../src/modules/guide-research/guide-research.service.js';

const gobiRoute = {
  id: '00000000-0000-4000-8000-000000000001',
  code: 'gobi',
  name: 'Gobi Desert Route',
  routeFamily: RouteFamily.GOBI,
  riskLevel: RouteRiskLevel.R2,
  minimumLanguageLevel: CefrLevel.B2,
  routeBadge: 'gobi',
  firstAidRequired: true,
  requiredGuideLegalRole: GuideLegalRole.LICENSED_PROFESSIONAL_GUIDE,
  requiredSpecialtySkills: ['remote-navigation', 'heat-safety'],
};

describe('competency-aware guide matching', () => {
  it('never lets rating override route, language or first-aid hard gates', async () => {
    const guideA = {
      id: 'a', userId: 'user-a', user: { id: 'user-a', name: 'Guide A', avatarUrl: null }, city: 'Dalanzadgad', country: 'Mongolia',
      languages: { en: 'C2' }, legalRole: 'UNVERIFIED', routeBadges: [], specialtySkills: [], firstAidVerified: false,
      evidence: [], rating: 5, reviewCount: 100, experienceYears: 10, assessmentScore: 95, providerCancellationCount: 0,
      languageAssessments: [{ humanVerifiedCefr: 'B1', aiEstimatedCefr: 'C2', assessmentStatus: 'HUMAN_VERIFIED' }],
      routeCompetencies: [], firstAidRecords: [], competencies: [],
    };
    const guideB = {
      id: 'b', userId: 'user-b', user: { id: 'user-b', name: 'Guide B', avatarUrl: null }, city: 'Dalanzadgad', country: 'Mongolia',
      languages: { en: 'B2' }, legalRole: 'LICENSED_PROFESSIONAL_GUIDE', routeBadges: ['gobi'], specialtySkills: ['remote-navigation', 'heat-safety'], firstAidVerified: true,
      evidence: [{ type: 'FIRST_AID', status: 'VERIFIED', expiresAt: new Date('2027-01-01'), reference: 'private-certificate' }],
      rating: 4.8, reviewCount: 20, experienceYears: 5, assessmentScore: 80, providerCancellationCount: 0,
      languageAssessments: [{ humanVerifiedCefr: 'B2', aiEstimatedCefr: 'C1', assessmentStatus: 'HUMAN_VERIFIED' }],
      routeCompetencies: [{ score: 88, status: 'HUMAN_VERIFIED', expiresAt: new Date('2027-01-01') }],
      firstAidRecords: [{ certificateStatus: 'DOCUMENT_VERIFIED', practicalVerificationStatus: 'NOT_ASSESSED', expiresAt: new Date('2027-01-01') }],
      competencies: [
        { competencyType: 'GENERAL_KNOWLEDGE', competencyCode: 'general', score: 80, status: 'HUMAN_VERIFIED' },
        { competencyType: 'GUIDE_SKILL', competencyCode: 'guide-skill', score: 82, status: 'HUMAN_VERIFIED' },
        { competencyType: 'SPECIALTY', competencyCode: 'remote-navigation', score: 90, status: 'HUMAN_VERIFIED' },
        { competencyType: 'SPECIALTY', competencyCode: 'heat-safety', score: 90, status: 'HUMAN_VERIFIED' },
      ],
    };
    const storedResults: unknown[] = [];
    const tx = {
      guideMatchRun: { create: jest.fn().mockResolvedValue({ id: 'match-run' }) },
      guideMatchResult: { createMany: jest.fn().mockImplementation(({ data }) => { storedResults.push(...data); return Promise.resolve({ count: data.length }); }) },
    };
    const prisma = {
      researchRoute: { findFirst: jest.fn().mockResolvedValue(gobiRoute) },
      guideProfile: { findMany: jest.fn().mockResolvedValue([guideA, guideB]) },
      $transaction: jest.fn().mockImplementation((callback) => callback(tx)),
    };
    const service = new GuideResearchService(prisma as never, new ConfigService());
    const result = await service.match({ routeId: 'gobi', language: 'en', minimumLanguageLevel: 'B2' }, 'requester');
    expect(result.eligible.map((item) => item.guideId)).toEqual(['b']);
    expect(result.rejected).toEqual([expect.objectContaining({ guideId: 'a', hardGateFailures: expect.arrayContaining(['LANGUAGE', 'ROUTE_COMPETENCY', 'FIRST_AID']) })]);
    expect(result.matchRunId).toBe('match-run');
    expect(storedResults).toHaveLength(2);
    expect(JSON.stringify(result)).not.toContain('private-certificate');
    expect(JSON.stringify(result)).not.toContain('C2');
  });

  it('uses live DB route requirements and prevents a caller lowering the language gate', async () => {
    const databaseRoute = {
      ...gobiRoute,
      code: 'admin-edited-route',
      name: 'Admin Edited Route',
      routeFamily: RouteFamily.WESTERN_ALTAI,
      riskLevel: RouteRiskLevel.R4,
      minimumLanguageLevel: CefrLevel.C1,
      routeBadge: 'admin-edited-badge',
      requiredGuideLegalRole: GuideLegalRole.SPECIALIST_INSTRUCTOR,
      requiredSpecialtySkills: ['admin-added-rescue-skill'],
    };
    const guide = {
      id: 'db-guide',
      userId: 'db-guide-user',
      user: { id: 'db-guide-user', name: 'Database Guide', avatarUrl: null },
      city: 'Ulgii',
      country: 'Mongolia',
      legalRole: GuideLegalRole.LICENSED_PROFESSIONAL_GUIDE,
      evidence: [],
      rating: 5,
      reviewCount: 50,
      experienceYears: 10,
      providerCancellationCount: 0,
      languageAssessments: [{
        humanVerifiedCefr: CefrLevel.B2,
        aiEstimatedCefr: CefrLevel.C2,
        assessmentStatus: 'HUMAN_VERIFIED',
      }],
      routeCompetencies: [{ score: 100, status: 'HUMAN_VERIFIED', expiresAt: null }],
      firstAidRecords: [{
        certificateStatus: 'DOCUMENT_VERIFIED',
        practicalVerificationStatus: 'VERIFIED',
        expiresAt: null,
      }],
      competencies: [],
    };
    let runData: Record<string, unknown> | undefined;
    const tx = {
      guideMatchRun: {
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          runData = data;
          return { id: 'db-match-run' };
        }),
      },
      guideMatchResult: { createMany: jest.fn(async () => ({ count: 1 })) },
    };
    const prisma = {
      researchRoute: { findFirst: jest.fn(async () => databaseRoute) },
      guideProfile: { findMany: jest.fn(async () => [guide]) },
      $transaction: jest.fn((callback: (client: typeof tx) => Promise<unknown>) => callback(tx)),
    };
    const result = await new GuideResearchService(prisma as never, new ConfigService()).match({
      routeId: databaseRoute.code,
      language: 'en',
      minimumLanguageLevel: CefrLevel.A1,
    }, 'requester');

    expect(prisma.researchRoute.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { active: true, OR: [{ code: databaseRoute.code }] },
      select: expect.objectContaining({
        minimumLanguageLevel: true,
        requiredGuideLegalRole: true,
        requiredSpecialtySkills: true,
      }),
    }));
    expect(result.routeId).toBe(databaseRoute.code);
    expect(result.eligible).toHaveLength(0);
    expect(result.rejected).toEqual([
      expect.objectContaining({
        guideId: guide.id,
        hardGateFailures: expect.arrayContaining([
          'LANGUAGE',
          'LEGAL_ROLE',
          'SPECIALTY:admin-added-rescue-skill',
        ]),
      }),
    ]);
    expect(runData).toMatchObject({
      routeId: databaseRoute.id,
      routeFamily: databaseRoute.routeFamily,
      minimumCefr: CefrLevel.C1,
      requirements: {
        riskClass: RouteRiskLevel.R4,
        legalRole: GuideLegalRole.SPECIALIST_INSTRUCTOR,
        firstAidRequired: true,
        specialtySkills: ['admin-added-rescue-skill'],
      },
    });
  });

  it('fails closed when a route is absent from DB unless static fallback is explicit', async () => {
    const prisma = { researchRoute: { findFirst: jest.fn(async () => null) } };
    await expect(new GuideResearchService(prisma as never, new ConfigService()).match({
      routeId: 'gobi',
      language: 'en',
      minimumLanguageLevel: CefrLevel.B2,
    })).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.researchRoute.findFirst).toHaveBeenCalledTimes(1);
  });
});
