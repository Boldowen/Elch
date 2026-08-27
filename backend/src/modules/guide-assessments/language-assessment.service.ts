import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AssessmentAttemptStatus, AssessmentQuestionType, AssessmentType, CefrLevel, GuideCompetencyStatus, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AI_PROVIDER } from '../ai/ai-provider.interface.js';
import type { AiProvider } from '../ai/ai-provider.interface.js';
import { EvaluateLanguageDto } from './dto/guide-assessment.dto.js';

@Injectable()
export class LanguageAssessmentService {
  constructor(private readonly prisma: PrismaService, @Inject(AI_PROVIDER) private readonly ai: AiProvider) {}

  async evaluate(userId: string, attemptId: string, dto: EvaluateLanguageDto) {
    if (dto.consentToAiProcessing !== true) throw new BadRequestException('Explicit AI processing consent is required');
    const attempt = await this.prisma.assessmentAttempt.findFirst({
      where: { id: attemptId, userId, assessmentType: AssessmentType.LANGUAGE },
      include: {
        responses: {
          include: {
            question: {
              select: { id: true, category: true, questionType: true, prompt: true },
            },
          },
        },
      },
    });
    if (!attempt) throw new NotFoundException('Language assessment attempt not found');
    if (attempt.status !== AssessmentAttemptStatus.SUBMITTED) throw new ConflictException('Language assessment is not awaiting AI evaluation');
    const language = dto.language.trim().toLowerCase();
    if (!attempt.language || attempt.language !== language) throw new ConflictException('Assessment language does not match');
    const questionIds = this.questionIds(attempt.metadata);
    const responseByQuestion = new Map(attempt.responses.map((response) => [response.questionId, response]));
    const savedResponses = questionIds.map((questionId) => responseByQuestion.get(questionId));
    if (!questionIds.length || savedResponses.some((response) =>
      !response ||
      response.question.questionType !== AssessmentQuestionType.SPEAKING_TASK ||
      !response.responseText?.trim()
    )) {
      throw new ConflictException('Complete every assigned saved speaking response before AI evaluation');
    }
    const providerInput = JSON.stringify(savedResponses.map((response) => ({
      question: {
        id: response!.question.id,
        category: response!.question.category,
        prompt: response!.question.prompt,
      },
      savedResponse: response!.responseText!.trim(),
    })));
    const evaluation = await this.ai.evaluateGuideResponse(providerInput, {
      purpose: 'AI language estimate only; never official certification',
      dimensions: ['fluency','grammar','vocabulary','interaction','clarity'],
      tasks: ['self-introduction','destination explanation','spontaneous questions','simplification','emergency communication'],
    });
    const dimensions = ['fluency','grammar','vocabulary','interaction','clarity'] as const;
    const scores = Object.fromEntries(dimensions.map((dimension) => [dimension, this.clamp(evaluation.scores[dimension] ?? 0)])) as Record<(typeof dimensions)[number], number>;
    const average = dimensions.reduce((sum, dimension) => sum + scores[dimension], 0) / dimensions.length;
    const cefr = this.cefr(average);
    const consentedAt = new Date();
    const metadata = this.consentMetadata(attempt.metadata, consentedAt);
    const assessment = await this.prisma.$transaction(async (tx) => {
      const claimed = await tx.assessmentAttempt.updateMany({
        where: { id: attempt.id, userId, status: AssessmentAttemptStatus.SUBMITTED },
        data: {
          status: AssessmentAttemptStatus.AI_SCORED,
          aiScore: average,
          score: average,
          passed: null,
          aiEstimatedCefr: cefr,
          aiConfidence: evaluation.confidence,
          metadata,
        },
      });
      if (claimed.count !== 1) throw new ConflictException('Language assessment has already been evaluated');
      const record = await tx.guideLanguageAssessment.upsert({
        where: { assessmentAttemptId: attempt.id },
        create: { guideProfileId: attempt.guideProfileId, assessmentAttemptId: attempt.id, language, aiEstimatedCefr: cefr, aiConfidence: evaluation.confidence, fluencyScore: scores.fluency, grammarScore: scores.grammar, vocabularyScore: scores.vocabulary, interactionScore: scores.interaction, clarityScore: scores.clarity, assessmentStatus: GuideCompetencyStatus.AI_PRE_SCREENED },
        update: { aiEstimatedCefr: cefr, aiConfidence: evaluation.confidence, fluencyScore: scores.fluency, grammarScore: scores.grammar, vocabularyScore: scores.vocabulary, interactionScore: scores.interaction, clarityScore: scores.clarity, assessmentStatus: GuideCompetencyStatus.AI_PRE_SCREENED },
      });
      return record;
    });
    return { label: 'AI Language Estimate — not an official CEFR certificate', estimatedCefr: assessment.aiEstimatedCefr, confidence: Number(assessment.aiConfidence), scores, unsafeActions: evaluation.unsafeActions, feedback: evaluation.feedback, humanVerificationRequired: true };
  }

  private cefr(score: number) { if (score >= 90) return CefrLevel.C2; if (score >= 80) return CefrLevel.C1; if (score >= 65) return CefrLevel.B2; if (score >= 50) return CefrLevel.B1; if (score >= 35) return CefrLevel.A2; return CefrLevel.A1; }
  private clamp(value: number) { return Math.max(0, Math.min(100, value)); }
  private questionIds(metadata: Prisma.JsonValue): string[] { if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return []; const ids = (metadata as Record<string, unknown>).questionIds; return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : []; }
  private consentMetadata(metadata: Prisma.JsonValue, consentedAt: Date): Prisma.InputJsonValue {
    const current = metadata && typeof metadata === 'object' && !Array.isArray(metadata)
      ? metadata as Record<string, Prisma.JsonValue>
      : {};
    return {
      ...current,
      aiProcessingConsent: {
        granted: true,
        consentedAt: consentedAt.toISOString(),
        scope: 'LANGUAGE_ASSESSMENT_SAVED_RESPONSES',
        clientTranscriptIgnored: true,
      },
    } as Prisma.InputJsonValue;
  }
}
