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
