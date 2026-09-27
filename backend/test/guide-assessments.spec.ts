import { BadRequestException, ConflictException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { AssessmentAttemptStatus, AssessmentQuestionType, AssessmentType, PracticalVerificationStatus } from '../src/generated/prisma/client.js';
import { GuideAssessmentsService } from '../src/modules/guide-assessments/guide-assessments.service.js';

describe('guide assessment safety', () => {
  it('never returns answer keys to a guide', async () => {
    const prisma = {
      assessmentAttempt: { findFirst: async () => ({ id: 'attempt', userId: 'owner', status: AssessmentAttemptStatus.IN_PROGRESS, metadata: { questionIds: ['q1'] }, responses: [] }) },
      assessmentQuestion: { findMany: async () => [{ id: 'q1', category: 'FIRST_AID_THEORY', routeFamily: null, difficulty: 'BASIC', language: 'en', questionType: 'MULTIPLE_CHOICE', prompt: 'Safe prompt', responseOptions: ['A', 'B'], answerKey: { correctOption: 'secret' } }] },
    };
    const result = await new GuideAssessmentsService(prisma as never).getOwned('owner', 'attempt');
    expect(JSON.stringify(result)).not.toContain('secret');
    expect(result.questions[0]).not.toHaveProperty('answerKey');
    expect(result.questions[0]).toHaveProperty('responseOptions', ['A', 'B']);
  });

  it('first-aid theory completion cannot verify practical skill', async () => {
    const created: Array<Record<string, unknown>> = [];
    const attempt = { id: 'attempt', userId: 'owner', guideProfileId: 'guide', assessmentType: AssessmentType.FIRST_AID_THEORY, status: AssessmentAttemptStatus.IN_PROGRESS, metadata: { questionIds: ['q1'] }, responses: [{ questionId: 'q1', responsePayload: { option: 'A' }, responseText: null, question: { questionType: AssessmentQuestionType.MULTIPLE_CHOICE, answerKey: { correctOption: 'A' } } }] };
    let stored = { ...attempt, score: null as number | null, passed: null as boolean | null };
    const tx = {
      assessmentAttempt: {
        findFirst: async () => attempt,
        updateMany: async ({ data }: { data: Record<string, unknown> }) => { stored = { ...stored, ...data } as typeof stored; return { count: 1 }; },
        findUniqueOrThrow: async () => stored,
      },
      guideFirstAid: { upsert: async ({ create }: { create: Record<string, unknown> }) => { created.push(create); return create; } },
    };
    const prisma = { $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx) };
    const result = await new GuideAssessmentsService(prisma as never).submit('owner', 'attempt');
    expect(result).toMatchObject({ score: 100, passed: true });
    expect(created[0]).toMatchObject({ theoryScore: 100, practicalVerificationStatus: PracticalVerificationStatus.NOT_ASSESSED });
    expect(created[0]).not.toHaveProperty('verifiedAt');
  });

  it('allows only one concurrent submission to claim an in-progress attempt', async () => {
    const attempt = {
      id: 'attempt', userId: 'owner', guideProfileId: 'guide',
      assessmentType: AssessmentType.GENERAL_KNOWLEDGE,
      status: AssessmentAttemptStatus.IN_PROGRESS,
      metadata: { questionIds: ['q1'] },
      responses: [{ questionId: 'q1', responsePayload: { option: 'A' }, responseText: null, question: { questionType: AssessmentQuestionType.MULTIPLE_CHOICE, answerKey: { correctOption: 'A' } } }],
    };
    let storedStatus: AssessmentAttemptStatus = AssessmentAttemptStatus.IN_PROGRESS;
    let successfulClaims = 0;
    let reads = 0;
    let releaseReads!: () => void;
    const bothReads = new Promise<void>((resolve) => { releaseReads = resolve; });
    const tx = {
      assessmentAttempt: {
        findFirst: async () => {
          const snapshotStatus = storedStatus;
          reads += 1;
          if (reads === 2) releaseReads();
          await bothReads;
          return { ...attempt, status: snapshotStatus };
        },
        updateMany: async ({ where, data }: { where: { status: AssessmentAttemptStatus }; data: { status: AssessmentAttemptStatus } }) => {
          if (storedStatus !== where.status) return { count: 0 };
          storedStatus = data.status;
          successfulClaims += 1;
          return { count: 1 };
        },
        findUniqueOrThrow: async () => ({ ...attempt, status: storedStatus, score: 100, passed: true }),
      },
      guideKnowledgeAssessment: { upsert: async () => ({}) },
      guideCompetency: { updateMany: async () => ({ count: 0 }), create: async () => ({}) },
    };
    const prisma = { $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx) };
    const service = new GuideAssessmentsService(prisma as never);

    const results = await Promise.allSettled([
      service.submit('owner', 'attempt'),
      service.submit('owner', 'attempt'),
    ]);

    const fulfilled = results.filter((result) => result.status === 'fulfilled');
    const rejected = results.filter((result) => result.status === 'rejected');
    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0]).toMatchObject({ reason: expect.any(ConflictException) });
    expect(successfulClaims).toBe(1);
    expect(storedStatus).toBe(AssessmentAttemptStatus.COMPLETED);
  });

  it('rejects empty responses using the assigned question type', async () => {
    const upsert = jest.fn();
    const prisma = {
      assessmentAttempt: { findFirst: async () => ({ id: 'attempt', userId: 'owner', status: AssessmentAttemptStatus.IN_PROGRESS, metadata: { questionIds: ['q1'] } }) },
      assessmentQuestion: { findFirst: async () => ({ questionType: AssessmentQuestionType.MULTIPLE_CHOICE }) },
      assessmentResponse: { upsert },
    };

    await expect(new GuideAssessmentsService(prisma as never).saveResponse('owner', 'attempt', {
      questionId: 'q1',
      responseText: '   ',
      responsePayload: {},
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(upsert).not.toHaveBeenCalled();
  });

  it('cannot submit a legacy empty response record', async () => {
    const updateMany = jest.fn();
    const attempt = {
      id: 'attempt', userId: 'owner', status: AssessmentAttemptStatus.IN_PROGRESS,
      metadata: { questionIds: ['q1'] },
      responses: [{
        questionId: 'q1', responseText: ' ', responsePayload: {}, audioReference: null,
        question: { questionType: AssessmentQuestionType.MULTIPLE_CHOICE, answerKey: { correctOption: 'A' } },
      }],
    };
    const tx = { assessmentAttempt: { findFirst: async () => attempt, updateMany } };
    const prisma = { $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx) };

    await expect(new GuideAssessmentsService(prisma as never).submit('owner', 'attempt'))
      .rejects.toBeInstanceOf(ConflictException);
    expect(updateMany).not.toHaveBeenCalled();
  });

  it('blocks cross-user attempt access', async () => {
    const prisma = { assessmentAttempt: { findFirst: async () => null } };
    await expect(new GuideAssessmentsService(prisma as never).getOwned('other-user', 'attempt')).rejects.toMatchObject({ status: 404 });
  });
});

describe('general knowledge form blueprint', () => {
  function bank(counts: Record<string, number>) {
    return Object.entries(counts).flatMap(([category, count]) =>
      Array.from({ length: count }, (_, index) => ({ id: `${category}-${index}`, category })));
  }

  async function startForm(candidates: Array<{ id: string; category: string }>, assessmentType = AssessmentType.GENERAL_KNOWLEDGE) {
    let created: { metadata: { questionIds: string[] } } | undefined;
    const prisma = {
      guideProfile: { findUnique: async () => ({ id: 'guide' }) },
      assessmentAttempt: {
        findFirst: async () => (created ? { ...created, id: 'attempt', userId: 'owner', responses: [] } : null),
        create: async ({ data }: { data: { metadata: { questionIds: string[] } } }) => { created = data; return { id: 'attempt' }; },
      },
      assessmentQuestion: { findMany: async () => candidates },
    };
    await new GuideAssessmentsService(prisma as never).start('owner', { assessmentType } as never);
    return created!.metadata.questionIds;
  }

  it('draws a 50-item form with the 2026 domain weights', async () => {
    const ids = await startForm(bank({ HISTORY_ARCHAEOLOGY: 40, RELIGION_CULTURE: 30, GEOGRAPHY_NATURE: 30, LAW_ETHICS: 12, SOCIETY_ECONOMY: 12 }));
    const perDomain = (prefix: string) => ids.filter((id) => id.startsWith(prefix)).length;
    expect(ids).toHaveLength(50);
    expect(new Set(ids).size).toBe(50);
    expect(perDomain('HISTORY_ARCHAEOLOGY')).toBe(15);
    expect(perDomain('LAW_ETHICS')).toBe(5);
    expect(perDomain('SOCIETY_ECONOMY')).toBe(5);
    expect([perDomain('RELIGION_CULTURE'), perDomain('GEOGRAPHY_NATURE')].sort()).toEqual([12, 13]);
  });

  it('never back-fills a thin domain from another domain', async () => {
    const ids = await startForm(bank({ HISTORY_ARCHAEOLOGY: 40, RELIGION_CULTURE: 30, GEOGRAPHY_NATURE: 30, LAW_ETHICS: 2, SOCIETY_ECONOMY: 0 }));
    expect(ids.filter((id) => id.startsWith('HISTORY_ARCHAEOLOGY'))).toHaveLength(15);
    expect(ids.filter((id) => id.startsWith('LAW_ETHICS'))).toHaveLength(2);
    expect(ids).toHaveLength(15 + 25 + 2);
  });

  it('keeps short random forms for the other assessment types', async () => {
    const ids = await startForm(bank({ SAFETY: 40 }), AssessmentType.SAFETY_SCENARIO);
    expect(ids).toHaveLength(10);
  });
});
