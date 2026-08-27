import { ConfigService } from '@nestjs/config';
import { jest } from '@jest/globals';
import { GuideResearchService } from '../src/modules/guide-research/guide-research.service.js';

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
      researchRoute: { findUnique: jest.fn().mockResolvedValue({ id: '00000000-0000-4000-8000-000000000001' }) },
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
});
