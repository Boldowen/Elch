import { ConflictException } from '@nestjs/common';
import { jest } from '@jest/globals';
import {
  AssessmentAttemptStatus,
  AssessmentCategory,
  AssessmentQuestionType,
  AssessmentReviewDecision,
  AssessmentType,
  CefrLevel,
  EvaluatorType,
  GuideCompetencyStatus,
  GuideCompetencyType,
  HumanReviewStatus,
  RouteFamily,
} from '../src/generated/prisma/client.js';
import { GuideAssessmentsService } from '../src/modules/guide-assessments/guide-assessments.service.js';

function objectiveResponse(id: string, category: AssessmentCategory, correct = true) {
  return {
    questionId: id,
    responsePayload: { option: correct ? 'A' : 'B' },
    responseText: null,
    question: {
      category,
      questionType: AssessmentQuestionType.MULTIPLE_CHOICE,
      answerKey: { correctOption: 'A' },
    },
  };
}

describe('guide assessment persistence lifecycle', () => {
  it('persists weighted raw knowledge totals and an AI pre-screened competency', async () => {
    const responses = [
      objectiveResponse('history', AssessmentCategory.HISTORY_ARCHAEOLOGY),
      objectiveResponse('culture', AssessmentCategory.RELIGION_CULTURE),
      objectiveResponse('geography', AssessmentCategory.GEOGRAPHY_NATURE),
      objectiveResponse('law', AssessmentCategory.LAW_ETHICS, false),
      objectiveResponse('society', AssessmentCategory.SOCIETY_ECONOMY),
    ];
    const attempt = {
      id: 'knowledge-attempt', userId: 'owner', guideProfileId: 'guide',
      assessmentType: AssessmentType.GENERAL_KNOWLEDGE,
      status: AssessmentAttemptStatus.IN_PROGRESS,
      rubricVersion: 'research-2026-v1',
      metadata: { questionIds: responses.map((response) => response.questionId) },
      responses,
    };
    let knowledgeCreate: Record<string, unknown> | undefined;
    let competencyCreate: Record<string, unknown> | undefined;
    let stored: Record<string, unknown> = attempt;
    const tx = {
      assessmentAttempt: {
        findFirst: async () => attempt,
        updateMany: async ({ data }: { data: Record<string, unknown> }) => { stored = { ...stored, ...data }; return { count: 1 }; },
        findUniqueOrThrow: async () => stored,
      },
      guideKnowledgeAssessment: {
        upsert: async ({ create }: { create: Record<string, unknown> }) => { knowledgeCreate = create; return create; },
      },
      guideCompetency: {
        updateMany: async () => ({ count: 0 }),
        create: async ({ data }: { data: Record<string, unknown> }) => { competencyCreate = data; return data; },
      },
    };
    const prisma = { $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx) };

    const result = await new GuideAssessmentsService(prisma as never).submit('owner', attempt.id);

    expect(result).toMatchObject({ status: AssessmentAttemptStatus.COMPLETED, score: 80, passed: true });
    expect(knowledgeCreate).toMatchObject({
      historyScore: 15,
      cultureScore: 12.5,
      geographyNatureScore: 12.5,
      lawEthicsScore: 0,
      societyEconomyScore: 5,
      totalScore: 45,
      pass: true,
      evaluatorType: EvaluatorType.AI,
    });
    expect(competencyCreate).toMatchObject({
      competencyType: GuideCompetencyType.GENERAL_KNOWLEDGE,
      competencyCode: 'GENERAL_KNOWLEDGE',
      score: 90,
      status: GuideCompetencyStatus.AI_PRE_SCREENED,
      verificationMethod: 'OBJECTIVE_PLATFORM_PRE_SCREEN',
    });
  });

  it('persists route objective results as non-verified AI pre-screening without expiry', async () => {
    const attempt = {
      id: 'route-attempt', userId: 'owner', guideProfileId: 'guide', routeId: 'route',
      routeFamily: RouteFamily.GOBI,
      assessmentType: AssessmentType.ROUTE_COMPETENCY,
      status: AssessmentAttemptStatus.IN_PROGRESS,
      metadata: { questionIds: ['q1'] },
      responses: [objectiveResponse('q1', AssessmentCategory.ROUTE_SPECIFIC)],
    };
    let routeCreate: Record<string, unknown> | undefined;
    let stored: Record<string, unknown> = attempt;
    const tx = {
      assessmentAttempt: {
        findFirst: async () => attempt,
        updateMany: async ({ data }: { data: Record<string, unknown> }) => { stored = { ...stored, ...data }; return { count: 1 }; },
        findUniqueOrThrow: async () => stored,
      },
      guideRouteCompetency: {
        upsert: async ({ create }: { create: Record<string, unknown> }) => { routeCreate = create; return create; },
      },
    };
    const prisma = { $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx) };

    const result = await new GuideAssessmentsService(prisma as never).submit('owner', attempt.id);

    expect(result).toMatchObject({ status: AssessmentAttemptStatus.AI_SCORED, requiresHumanReview: true });
    expect(routeCreate).toMatchObject({
      routeFamily: RouteFamily.GOBI,
      score: 100,
      status: GuideCompetencyStatus.AI_PRE_SCREENED,
      evaluatorType: EvaluatorType.AI,
    });
    expect(routeCreate).not.toHaveProperty('passedAt');
    expect(routeCreate).not.toHaveProperty('expiresAt');
  });

  it('grants an expiring route competency only after a passing human verification', async () => {
    const attempt = {
      id: 'route-attempt', guideProfileId: 'guide', routeId: 'route', routeFamily: RouteFamily.GOBI,
      assessmentType: AssessmentType.ROUTE_COMPETENCY,
      status: AssessmentAttemptStatus.AI_SCORED,
      score: 80, aiScore: 80,
    };
    let routeUpdate: Record<string, unknown> | undefined;
    let attemptClaim: Record<string, unknown> | undefined;
    const tx = {
      assessmentAttempt: {
        findUnique: async () => attempt,
        updateMany: async ({ data }: { data: Record<string, unknown> }) => { attemptClaim = data; return { count: 1 }; },
      },
      assessmentReview: { upsert: async ({ create }: { create: Record<string, unknown> }) => create },
      guideRouteCompetency: {
        upsert: async ({ update }: { update: Record<string, unknown> }) => { routeUpdate = update; return update; },
      },
    };
    const prisma = { $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx) };

    await new GuideAssessmentsService(prisma as never).review('reviewer', attempt.id, {
      decision: AssessmentReviewDecision.VERIFIED,
      humanScore: 88,
      humanPassed: true,
    });

    expect(attemptClaim).toMatchObject({ status: AssessmentAttemptStatus.HUMAN_REVIEWED, score: 88, passed: true });
    expect(routeUpdate).toMatchObject({
      score: 88,
      status: GuideCompetencyStatus.HUMAN_VERIFIED,
      evaluatorType: EvaluatorType.HUMAN,
      passedAt: expect.any(Date),
      expiresAt: expect.any(Date),
    });
    expect((routeUpdate?.expiresAt as Date).getTime()).toBeGreaterThan((routeUpdate?.passedAt as Date).getTime());
  });

  it.each([AssessmentType.GUIDE_SKILL, AssessmentType.SAFETY_SCENARIO])(
    'persists structured %s AI pre-score without granting verification',
    async (assessmentType) => {
      const attempt = {
        id: `${assessmentType}-attempt`, userId: 'owner', guideProfileId: 'guide',
        assessmentType,
        status: AssessmentAttemptStatus.IN_PROGRESS,
        rubricVersion: 'research-2026-v1',
        metadata: { questionIds: ['q1'] },
        responses: [{
          questionId: 'q1', responseText: 'Stored open response', responsePayload: null,
          question: {
            category: assessmentType === AssessmentType.GUIDE_SKILL ? AssessmentCategory.GUIDE_SKILL : AssessmentCategory.SAFETY,
            questionType: AssessmentQuestionType.SCENARIO,
            prompt: 'Handle the scenario safely.',
            answerKey: { private: 'never sent' },
          },
        }],
      };
      let status = AssessmentAttemptStatus.IN_PROGRESS;
      let skillCreate: Record<string, unknown> | undefined;
      let competencyCreate: Record<string, unknown> | undefined;
      const tx = {
        assessmentAttempt: {
          findFirst: async () => ({ ...attempt, status }),
          updateMany: async ({ where, data }: { where: { status: AssessmentAttemptStatus }; data: Record<string, unknown> }) => {
            if (status !== where.status) return { count: 0 };
            status = data.status as AssessmentAttemptStatus;
            return { count: 1 };
          },
          findUniqueOrThrow: async () => ({ ...attempt, status, score: status === AssessmentAttemptStatus.AI_SCORED ? 80 : null }),
        },
        guideSkillAssessment: {
          upsert: async ({ create }: { create: Record<string, unknown> }) => { skillCreate = create; return create; },
        },
        guideCompetency: {
          updateMany: async () => ({ count: 0 }),
          create: async ({ data }: { data: Record<string, unknown> }) => { competencyCreate = data; return data; },
        },
      };
      const prisma = {
        assessmentAttempt: { findFirst: async () => ({ ...attempt, status }) },
        $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx),
      };
      const ai = {
        evaluateGuideResponse: jest.fn(async () => ({
          scores: {
            communication: 80,
            guidingTechnique: 80,
            explanationStructure: 80,
            factualPresentation: 80,
            groupCare: 80,
            questionHandling: 80,
            professionalism: 80,
          },
          confidence: 0.75,
          unsafeActions: [],
          feedback: 'Structured pre-screen feedback',
        })),
      };

      const result = await new GuideAssessmentsService(prisma as never, ai as never).submit('owner', attempt.id);

      const providerInput = ai.evaluateGuideResponse.mock.calls[0][0] as string;
      expect(providerInput).toContain('Stored open response');
      expect(providerInput).not.toContain('never sent');
      expect(result).toMatchObject({ status: AssessmentAttemptStatus.AI_SCORED, score: 80, requiresHumanReview: true });
      expect(skillCreate).toMatchObject({ totalScore: 40, aiConfidence: 0.75, humanReviewStatus: HumanReviewStatus.PENDING });
      expect(competencyCreate).toMatchObject({
        competencyType: assessmentType === AssessmentType.GUIDE_SKILL ? GuideCompetencyType.GUIDE_SKILL : GuideCompetencyType.SAFETY,
        score: 80,
        status: GuideCompetencyStatus.AI_PRE_SCREENED,
      });
    },
  );

  it.each([AssessmentType.GUIDE_SKILL, AssessmentType.SAFETY_SCENARIO])(
    'human review overrides %s total and promotes its competency',
    async (assessmentType) => {
      const attempt = {
        id: `${assessmentType}-attempt`, guideProfileId: 'guide', assessmentType,
        status: AssessmentAttemptStatus.AI_SCORED,
        score: 80, aiScore: 80, aiConfidence: 0.75,
      };
      let skillUpdate: Record<string, unknown> | undefined;
      let competencyUpdate: Record<string, unknown> | undefined;
      const competencyCreate = jest.fn();
      const tx = {
        assessmentAttempt: { findUnique: async () => attempt, updateMany: async () => ({ count: 1 }) },
        assessmentReview: { upsert: async ({ create }: { create: Record<string, unknown> }) => create },
        guideSkillAssessment: {
          upsert: async ({ update }: { update: Record<string, unknown> }) => { skillUpdate = update; return update; },
        },
        guideCompetency: {
          updateMany: async ({ data }: { data: Record<string, unknown> }) => { competencyUpdate = data; return { count: 1 }; },
          create: competencyCreate,
        },
      };
      const prisma = { $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx) };

      await new GuideAssessmentsService(prisma as never).review('reviewer', attempt.id, {
        decision: AssessmentReviewDecision.VERIFIED,
        humanScore: 90,
        humanPassed: true,
      });

      expect(skillUpdate).toEqual({ totalScore: 45, humanReviewStatus: HumanReviewStatus.VERIFIED });
      expect(competencyUpdate).toMatchObject({
        score: 90,
        status: GuideCompetencyStatus.HUMAN_VERIFIED,
        verifiedById: 'reviewer',
        verificationMethod: 'HUMAN_REVIEW',
      });
      expect(competencyCreate).not.toHaveBeenCalled();
    },
  );

  it('human-verifies language level and records its verifier', async () => {
    const attempt = {
      id: 'language-attempt', guideProfileId: 'guide', assessmentType: AssessmentType.LANGUAGE,
      status: AssessmentAttemptStatus.AI_SCORED,
      language: 'en', score: 75, aiScore: 75,
    };
    let languageUpdate: Record<string, unknown> | undefined;
    const tx = {
      assessmentAttempt: { findUnique: async () => attempt, updateMany: async () => ({ count: 1 }) },
      assessmentReview: { upsert: async ({ create }: { create: Record<string, unknown> }) => create },
      guideLanguageAssessment: {
        upsert: async ({ update }: { update: Record<string, unknown> }) => { languageUpdate = update; return update; },
      },
    };
    const prisma = { $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx) };

    await new GuideAssessmentsService(prisma as never).review('reviewer', attempt.id, {
      decision: AssessmentReviewDecision.VERIFIED,
      humanCefr: CefrLevel.B2,
    });

    expect(languageUpdate).toEqual({
      humanVerifiedCefr: CefrLevel.B2,
      assessmentStatus: GuideCompetencyStatus.HUMAN_VERIFIED,
      verifiedById: 'reviewer',
    });
  });

  it('claims review state before writing review or competency side effects', async () => {
    const reviewUpsert = jest.fn();
    const skillUpsert = jest.fn();
    const attempt = {
      id: 'skill-attempt', guideProfileId: 'guide', assessmentType: AssessmentType.GUIDE_SKILL,
      status: AssessmentAttemptStatus.AI_SCORED, score: 80, aiScore: 80,
    };
    const tx = {
      assessmentAttempt: { findUnique: async () => attempt, updateMany: async () => ({ count: 0 }) },
      assessmentReview: { upsert: reviewUpsert },
      guideSkillAssessment: { upsert: skillUpsert },
    };
    const prisma = { $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx) };

    await expect(new GuideAssessmentsService(prisma as never).review('reviewer', attempt.id, {
      decision: AssessmentReviewDecision.VERIFIED,
      humanScore: 90,
      humanPassed: true,
    })).rejects.toBeInstanceOf(ConflictException);
    expect(reviewUpsert).not.toHaveBeenCalled();
    expect(skillUpsert).not.toHaveBeenCalled();
  });

  it('keeps blind review queue projections free of identity, AI score, and answer keys', async () => {
    const findMany = jest.fn(async () => []);
    const service = new GuideAssessmentsService({ assessmentAttempt: { findMany } } as never);

    await service.reviewQueue(true);

    const query = findMany.mock.calls[0][0] as { select: Record<string, unknown> };
    const serialized = JSON.stringify(query.select);
    expect(serialized).toContain('responses');
    expect(serialized).toContain('responseOptions');
    expect(serialized).not.toContain('answerKey');
    expect(serialized).not.toContain('scoringRubric');
    expect(serialized).not.toContain('guideProfile');
    expect(serialized).not.toContain('aiScore');
  });

  it('reloads the concurrently-created active attempt after a P2002 start race', async () => {
    let activeLookups = 0;
    const create = jest.fn(async () => { throw { code: 'P2002' }; });
    const assessmentAttempt = {
      findFirst: jest.fn(async ({ where }: { where: Record<string, unknown> }) => {
        if (where.id === 'concurrent-attempt') {
          return { id: 'concurrent-attempt', metadata: { questionIds: ['q1'] }, responses: [] };
        }
        activeLookups += 1;
        return activeLookups === 1 ? null : { id: 'concurrent-attempt' };
      }),
      create,
    };
    const assessmentQuestion = {
      findMany: jest.fn(async ({ select }: { select: Record<string, unknown> }) =>
        Object.keys(select).length === 1
          ? [{ id: 'q1' }]
          : [{ id: 'q1', category: AssessmentCategory.GUIDE_SKILL, routeFamily: null, difficulty: 'BASIC', language: 'en', questionType: AssessmentQuestionType.SCENARIO, prompt: 'Prompt', responseOptions: null }]
      ),
    };
    const prisma = {
      guideProfile: { findUnique: async () => ({ id: 'guide' }) },
      assessmentAttempt,
      assessmentQuestion,
    };

    const result = await new GuideAssessmentsService(prisma as never).start('owner', {
      assessmentType: AssessmentType.GUIDE_SKILL,
      language: 'EN',
    });

    expect(result).toMatchObject({ id: 'concurrent-attempt' });
    expect(create).toHaveBeenCalledTimes(1);
    expect(assessmentAttempt.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ language: 'en', routeFamily: null }),
    }));
  });
});
