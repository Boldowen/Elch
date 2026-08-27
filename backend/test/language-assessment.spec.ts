import { BadRequestException, ConflictException } from '@nestjs/common';
import { jest } from '@jest/globals';
import {
  AssessmentAttemptStatus,
  AssessmentQuestionType,
  AssessmentType,
  CefrLevel,
  GuideCompetencyStatus,
} from '../src/generated/prisma/client.js';
import { LanguageAssessmentService } from '../src/modules/guide-assessments/language-assessment.service.js';

function languageAttempt(overrides: Record<string, unknown> = {}) {
  return {
    id: 'attempt',
    userId: 'owner',
    guideProfileId: 'guide',
    assessmentType: AssessmentType.LANGUAGE,
    status: AssessmentAttemptStatus.SUBMITTED,
    language: 'en',
    metadata: { questionIds: ['q1'] },
    responses: [{
      questionId: 'q1',
      responseText: 'Stored speaking response about Kharkhorin',
      responsePayload: null,
      audioReference: null,
      question: {
        id: 'q1',
        category: 'LANGUAGE',
        questionType: AssessmentQuestionType.SPEAKING_TASK,
        prompt: 'Explain Kharkhorin.',
      },
    }],
    ...overrides,
  };
}

describe('AI language pre-screen', () => {
  it('requires explicit AI-processing consent before invoking the provider', async () => {
    const ai = { evaluateGuideResponse: jest.fn() };
    const prisma = { assessmentAttempt: { findFirst: jest.fn() } };
    const service = new LanguageAssessmentService(prisma as never, ai as never);

    await expect(service.evaluate('owner', 'attempt', {
      language: 'en',
      consentToAiProcessing: false,
      transcript: 'untrusted client transcript',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(ai.evaluateGuideResponse).not.toHaveBeenCalled();
    expect(prisma.assessmentAttempt.findFirst).not.toHaveBeenCalled();
  });

  it('scores only complete stored speaking responses, records consent, and ignores dto transcript', async () => {
    const attempt = languageAttempt();
    const stored = { aiEstimatedCefr: CefrLevel.B2, aiConfidence: 0.8 };
    let claimedData: Record<string, unknown> | undefined;
    let assessmentCreate: Record<string, unknown> | undefined;
    const tx = {
      assessmentAttempt: {
        updateMany: async ({ data }: { data: Record<string, unknown> }) => { claimedData = data; return { count: 1 }; },
      },
      guideLanguageAssessment: {
        upsert: async ({ create }: { create: Record<string, unknown> }) => { assessmentCreate = create; return stored; },
      },
    };
    const prisma = {
      assessmentAttempt: { findFirst: async () => attempt },
      $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx),
    };
    const ai = {
      evaluateGuideResponse: jest.fn(async () => ({
        scores: { fluency: 70, grammar: 70, vocabulary: 70, interaction: 70, clarity: 70 },
        confidence: 0.8,
        unsafeActions: [],
        feedback: 'Research feedback',
      })),
    };
    const result = await new LanguageAssessmentService(prisma as never, ai as never).evaluate('owner', 'attempt', {
      language: 'EN',
      consentToAiProcessing: true,
      transcript: 'ARBITRARY DTO TRANSCRIPT MUST BE IGNORED',
    });

    const providerInput = ai.evaluateGuideResponse.mock.calls[0][0] as string;
    expect(providerInput).toContain('Stored speaking response about Kharkhorin');
    expect(providerInput).not.toContain('ARBITRARY DTO TRANSCRIPT MUST BE IGNORED');
    expect(claimedData).toMatchObject({ status: AssessmentAttemptStatus.AI_SCORED, passed: null });
    expect(claimedData?.metadata).toMatchObject({
      questionIds: ['q1'],
      aiProcessingConsent: {
        granted: true,
        scope: 'LANGUAGE_ASSESSMENT_SAVED_RESPONSES',
        clientTranscriptIgnored: true,
      },
    });
    expect(assessmentCreate).toMatchObject({
      language: 'en',
      assessmentStatus: GuideCompetencyStatus.AI_PRE_SCREENED,
    });
    expect(assessmentCreate).not.toHaveProperty('humanVerifiedCefr');
    expect(result.estimatedCefr).toBe(CefrLevel.B2);
    expect(result.label).toContain('Estimate');
    expect(result.label).toContain('not an official');
    expect(result.humanVerificationRequired).toBe(true);
  });

  it('rejects incomplete saved speaking responses before invoking AI', async () => {
    const attempt = languageAttempt({ responses: [] });
    const prisma = { assessmentAttempt: { findFirst: async () => attempt } };
    const ai = { evaluateGuideResponse: jest.fn() };

    await expect(new LanguageAssessmentService(prisma as never, ai as never).evaluate('owner', 'attempt', {
      language: 'en',
      consentToAiProcessing: true,
    })).rejects.toBeInstanceOf(ConflictException);
    expect(ai.evaluateGuideResponse).not.toHaveBeenCalled();
  });

  it('uses a conditional state claim so a second evaluation cannot upsert', async () => {
    const attempt = languageAttempt();
    const upsert = jest.fn();
    const tx = {
      assessmentAttempt: { updateMany: async () => ({ count: 0 }) },
      guideLanguageAssessment: { upsert },
    };
    const prisma = {
      assessmentAttempt: { findFirst: async () => attempt },
      $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx),
    };
    const ai = { evaluateGuideResponse: async () => ({ scores: {}, confidence: 0, unsafeActions: [], feedback: '' }) };

    await expect(new LanguageAssessmentService(prisma as never, ai as never).evaluate('owner', 'attempt', {
      language: 'en',
      consentToAiProcessing: true,
    })).rejects.toBeInstanceOf(ConflictException);
    expect(upsert).not.toHaveBeenCalled();
  });
});
