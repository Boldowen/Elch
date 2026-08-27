import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, Optional } from '@nestjs/common';
import {
  AssessmentAttemptStatus, AssessmentCategory, AssessmentQuestionType, AssessmentReviewDecision,
  AssessmentType, EvaluatorType, GuideCompetencyStatus, GuideCompetencyType,
  HumanReviewStatus, PracticalVerificationStatus, Prisma,
} from '../../generated/prisma/client.js';
import type { AssessmentAttempt } from '../../generated/prisma/client.js';
import { randomInt } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AI_PROVIDER } from '../ai/ai-provider.interface.js';
import type { AiProvider } from '../ai/ai-provider.interface.js';
import type { GuideResponseEvaluation } from '../ai/ai.types.js';
import { CreateAssessmentQuestionDto, HumanReviewDto, SaveAssessmentResponseDto, StartAssessmentDto } from './dto/guide-assessment.dto.js';

const CATEGORY_BY_TYPE: Record<AssessmentType, AssessmentCategory[]> = {
  LANGUAGE: [AssessmentCategory.LANGUAGE],
  GENERAL_KNOWLEDGE: [AssessmentCategory.HISTORY_ARCHAEOLOGY, AssessmentCategory.RELIGION_CULTURE, AssessmentCategory.GEOGRAPHY_NATURE, AssessmentCategory.LAW_ETHICS, AssessmentCategory.SOCIETY_ECONOMY],
  GUIDE_SKILL: [AssessmentCategory.GUIDE_SKILL], ROUTE_COMPETENCY: [AssessmentCategory.ROUTE_SPECIFIC],
  FIRST_AID_THEORY: [AssessmentCategory.FIRST_AID_THEORY], SAFETY_SCENARIO: [AssessmentCategory.SAFETY],
};

const KNOWLEDGE_WEIGHTS = {
  [AssessmentCategory.HISTORY_ARCHAEOLOGY]: 15,
  [AssessmentCategory.RELIGION_CULTURE]: 12.5,
  [AssessmentCategory.GEOGRAPHY_NATURE]: 12.5,
  [AssessmentCategory.LAW_ETHICS]: 5,
  [AssessmentCategory.SOCIETY_ECONOMY]: 5,
} as const;

const SKILL_WEIGHTS = {
  communication: 10,
  guidingTechnique: 10,
  explanationStructure: 10,
  factualPresentation: 8,
  groupCare: 5,
  questionHandling: 4,
  professionalism: 3,
} as const;

const VERIFIED_ROUTE_VALIDITY_MS = 365 * 24 * 60 * 60 * 1000;

type AttemptWithResponses = Prisma.AssessmentAttemptGetPayload<{
  include: { responses: { include: { question: true } } };
}>;

type SkillBreakdown = {
  communicationScore: number;
  guidingTechniqueScore: number;
  explanationStructureScore: number;
  factualPresentationScore: number;
  groupCareScore: number;
  questionHandlingScore: number;
  professionalismScore: number;
  totalScore: number;
};

@Injectable()
export class GuideAssessmentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional() @Inject(AI_PROVIDER) private readonly ai?: AiProvider,
  ) {}

  async dashboard(userId: string) {
    const guide = await this.guideForUser(userId);
    const [attempts, language, route, firstAid] = await Promise.all([
      this.prisma.assessmentAttempt.findMany({ where: { guideProfileId: guide.id }, orderBy: { createdAt: 'desc' }, take: 20, select: this.attemptSummarySelect() }),
      this.prisma.guideLanguageAssessment.findFirst({ where: { guideProfileId: guide.id }, orderBy: { createdAt: 'desc' }, select: { language: true, aiEstimatedCefr: true, aiConfidence: true, humanVerifiedCefr: true, assessmentStatus: true, createdAt: true } }),
      this.prisma.guideRouteCompetency.findMany({ where: { guideProfileId: guide.id }, select: { routeFamily: true, score: true, status: true, passedAt: true, expiresAt: true } }),
      this.prisma.guideFirstAid.findFirst({ where: { guideProfileId: guide.id }, orderBy: { createdAt: 'desc' }, select: { certificateStatus: true, theoryScore: true, practicalVerificationStatus: true, expiresAt: true } }),
    ]);
    return { label: 'Platform research pre-screening; not official certification', guideId: guide.id, attempts, languageEstimate: language, routeCompetencies: route, firstAid };
  }

  async start(userId: string, dto: StartAssessmentDto) {
    const guide = await this.guideForUser(userId);
    if (dto.assessmentType === AssessmentType.ROUTE_COMPETENCY && !dto.routeFamily) throw new ConflictException('routeFamily is required');
    const language = dto.language?.trim().toLowerCase();
    const activeWhere: Prisma.AssessmentAttemptWhereInput = {
      userId,
      assessmentType: dto.assessmentType,
      routeFamily: dto.routeFamily ?? null,
      language: language ?? null,
      status: { in: [AssessmentAttemptStatus.NOT_STARTED, AssessmentAttemptStatus.IN_PROGRESS] },
    };
    const existing = await this.prisma.assessmentAttempt.findFirst({ where: activeWhere });
    if (existing) return this.getOwned(userId, existing.id);
    const candidates = await this.prisma.assessmentQuestion.findMany({
      where: { active: true, category: { in: CATEGORY_BY_TYPE[dto.assessmentType] }, ...(dto.routeFamily ? { OR: [{ routeFamily: dto.routeFamily }, { routeFamily: null }] } : {}), ...(language ? { language } : {}) },
      select: { id: true }, take: 100,
    });
    if (!candidates.length) throw new NotFoundException('No active assessment questions are available');
    const questionIds = this.shuffle(candidates.map((item) => item.id)).slice(0, Math.min(10, candidates.length));
    let attempt;
    try {
      attempt = await this.prisma.assessmentAttempt.create({ data: {
        userId, guideProfileId: guide.id, assessmentType: dto.assessmentType, routeFamily: dto.routeFamily,
        language, status: AssessmentAttemptStatus.IN_PROGRESS, rubricVersion: 'research-2026-v1',
        startedAt: new Date(), metadata: { questionIds, answerKeysExposed: false },
      } });
    } catch (error) {
      if (!this.isUniqueConstraint(error)) throw error;
      const concurrent = await this.prisma.assessmentAttempt.findFirst({ where: activeWhere });
      if (!concurrent) throw error;
      attempt = concurrent;
    }
    return this.getOwned(userId, attempt.id);
  }

  async history(userId: string) {
    const guide = await this.guideForUser(userId);
    return this.prisma.assessmentAttempt.findMany({ where: { guideProfileId: guide.id }, orderBy: { createdAt: 'desc' }, select: this.attemptSummarySelect() });
  }

  async getOwned(userId: string, id: string) {
    const attempt = await this.prisma.assessmentAttempt.findFirst({ where: { id, userId }, include: { responses: { select: { questionId: true, responseText: true, responsePayload: true, audioReference: true, createdAt: true } } } });
    if (!attempt) throw new NotFoundException('Assessment attempt not found');
    const questionIds = this.questionIds(attempt.metadata);
    const questions = await this.prisma.assessmentQuestion.findMany({ where: { id: { in: questionIds }, active: true }, select: { id: true, category: true, routeFamily: true, difficulty: true, language: true, questionType: true, prompt: true, responseOptions: true } });
    const order = new Map(questionIds.map((questionId, index) => [questionId, index]));
    const safeQuestions = questions.sort((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0)).map((question) => ({
      id: question.id, category: question.category, routeFamily: question.routeFamily, difficulty: question.difficulty,
      language: question.language, questionType: question.questionType, prompt: question.prompt, responseOptions: question.responseOptions,
    }));
    return { ...attempt, questions: safeQuestions };
  }

  async saveResponse(userId: string, id: string, dto: SaveAssessmentResponseDto) {
    const attempt = await this.prisma.assessmentAttempt.findFirst({ where: { id, userId } });
    if (!attempt) throw new NotFoundException('Assessment attempt not found');
    if (attempt.status !== AssessmentAttemptStatus.IN_PROGRESS) throw new ConflictException('Assessment is not open for responses');
    if (!this.questionIds(attempt.metadata).includes(dto.questionId)) throw new ForbiddenException('Question is not part of this attempt');
    const question = await this.prisma.assessmentQuestion.findFirst({
      where: { id: dto.questionId, active: true },
      select: { questionType: true },
    });
    if (!question) throw new NotFoundException('Assessment question not found');
    if (!this.hasResponse(question.questionType, dto.responseText, dto.responsePayload, dto.audioReference)) {
      throw new BadRequestException('A non-empty response appropriate for the question type is required');
    }
    return this.prisma.assessmentResponse.upsert({
      where: { assessmentAttemptId_questionId: { assessmentAttemptId: id, questionId: dto.questionId } },
      create: { assessmentAttemptId: id, questionId: dto.questionId, responseText: dto.responseText?.trim(), responsePayload: dto.responsePayload as Prisma.InputJsonValue | undefined, audioReference: dto.audioReference },
      update: { responseText: dto.responseText?.trim(), responsePayload: dto.responsePayload as Prisma.InputJsonValue | undefined, audioReference: dto.audioReference },
      select: { id: true, questionId: true, createdAt: true, updatedAt: true },
    });
  }

  async submit(userId: string, id: string) {
    const submitted = await this.prisma.$transaction(async (tx) => {
      const attempt = await tx.assessmentAttempt.findFirst({ where: { id, userId }, include: { responses: { include: { question: true } } } });
      if (!attempt) throw new NotFoundException('Assessment attempt not found');
      if (attempt.status !== AssessmentAttemptStatus.IN_PROGRESS) throw new ConflictException('Assessment has already been submitted');
      const questionIds = this.questionIds(attempt.metadata);
      const answeredQuestionIds = new Set(attempt.responses.map((response) => response.questionId));
      if (!questionIds.length || questionIds.some((questionId) => !answeredQuestionIds.has(questionId))) {
        throw new ConflictException('Answer every assigned question before submitting');
      }
      if (attempt.responses.some((response) => !this.hasResponse(
        response.question.questionType,
        response.responseText,
        response.responsePayload,
        response.audioReference,
      ))) {
        throw new ConflictException('Every assigned question requires a non-empty response');
      }
      const objective = attempt.responses.filter((response) => response.question.questionType === AssessmentQuestionType.MULTIPLE_CHOICE);
      const correct = objective.filter((response) => this.isCorrect(response.question.answerKey, response.responsePayload, response.responseText)).length;
      const allObjective = objective.length === attempt.responses.length;
      const score = allObjective ? (correct * 100) / objective.length : null;
      const supportsAiPreScore = !allObjective && (
        attempt.assessmentType === AssessmentType.GUIDE_SKILL ||
        attempt.assessmentType === AssessmentType.SAFETY_SCENARIO
      );
      const needsHuman = !allObjective || attempt.assessmentType === AssessmentType.ROUTE_COMPETENCY;
      const status = allObjective
        ? (needsHuman ? AssessmentAttemptStatus.AI_SCORED : AssessmentAttemptStatus.COMPLETED)
        : AssessmentAttemptStatus.SUBMITTED;
      const update = {
        status,
        submittedAt: new Date(), completedAt: needsHuman ? null : new Date(), score, aiScore: score,
        passed: score === null ? null : score >= 70,
      };
      const claimed = await tx.assessmentAttempt.updateMany({
        where: { id, userId, status: AssessmentAttemptStatus.IN_PROGRESS },
        data: update,
      });
      if (claimed.count !== 1) throw new ConflictException('Assessment has already been submitted');
      if (attempt.assessmentType === AssessmentType.GENERAL_KNOWLEDGE && allObjective) {
        await this.persistKnowledgePreScreen(tx, attempt);
      }
      if (attempt.assessmentType === AssessmentType.ROUTE_COMPETENCY && score !== null) {
        await this.persistRoutePreScreen(tx, attempt, score);
      }
      if (attempt.assessmentType === AssessmentType.FIRST_AID_THEORY) {
        await tx.guideFirstAid.upsert({
          where: { assessmentAttemptId: id },
          create: { guideProfileId: attempt.guideProfileId, assessmentAttemptId: id, theoryScore: score, practicalVerificationStatus: PracticalVerificationStatus.NOT_ASSESSED },
          update: { theoryScore: score },
        });
      }
      const updated = await tx.assessmentAttempt.findUniqueOrThrow({ where: { id } });
      return {
        response: { ...updated, label: attempt.assessmentType === AssessmentType.LANGUAGE ? 'AI Language Estimate — not official CEFR certification' : 'Platform research pre-screening', requiresHumanReview: needsHuman },
        supportsAiPreScore,
      };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    if (!submitted.supportsAiPreScore || !this.ai) return submitted.response;
    return await this.persistAiSkillPreScore(userId, id) ?? submitted.response;
  }

  reviewQueue(blind = true) {
    return this.prisma.assessmentAttempt.findMany({
      where: { status: { in: [AssessmentAttemptStatus.SUBMITTED, AssessmentAttemptStatus.AI_SCORED] } },
      orderBy: { submittedAt: 'asc' }, take: 100,
      select: {
        id: true,
        assessmentType: true,
        routeFamily: true,
        language: true,
        submittedAt: true,
        responses: {
          select: {
            id: true,
            responseText: true,
            responsePayload: true,
            audioReference: true,
            question: {
              select: {
                id: true,
                category: true,
                routeFamily: true,
                difficulty: true,
                language: true,
                questionType: true,
                prompt: true,
                responseOptions: true,
              },
            },
          },
        },
        ...(blind ? {} : {
          aiScore: true,
          aiEstimatedCefr: true,
          aiConfidence: true,
          guideProfile: { select: { id: true, user: { select: { name: true } } } },
        }),
      },
    });
  }

  async review(reviewerId: string, attemptId: string, dto: HumanReviewDto) {
    return this.prisma.$transaction(async (tx) => {
      const attempt = await tx.assessmentAttempt.findUnique({ where: { id: attemptId } });
      if (!attempt) throw new NotFoundException('Assessment attempt not found');
      if (attempt.status !== AssessmentAttemptStatus.SUBMITTED && attempt.status !== AssessmentAttemptStatus.AI_SCORED) {
        throw new ConflictException('Assessment is not awaiting human review');
      }
      this.validateHumanReview(attempt, dto);
      const reviewedAt = new Date();
      const humanPassed = dto.decision === AssessmentReviewDecision.VERIFIED
        ? (dto.humanPassed ?? true)
        : false;
      const claimed = await tx.assessmentAttempt.updateMany({
        where: { id: attemptId, status: attempt.status },
        data: {
          status: AssessmentAttemptStatus.HUMAN_REVIEWED,
          humanScore: dto.humanScore,
          humanPassed,
          humanCefr: dto.humanCefr,
          ...(dto.humanScore === undefined ? {} : { score: dto.humanScore }),
          passed: humanPassed,
          completedAt: reviewedAt,
        },
      });
      if (claimed.count !== 1) throw new ConflictException('Assessment has already been reviewed');
      const review = await tx.assessmentReview.upsert({
        where: { assessmentAttemptId_reviewerId: { assessmentAttemptId: attemptId, reviewerId } },
        create: { assessmentAttemptId: attemptId, reviewerId, blindEvaluation: true, decision: dto.decision, humanScore: dto.humanScore, humanPassed: dto.humanPassed, humanCefr: dto.humanCefr, notes: dto.notes?.trim() },
        update: { decision: dto.decision, humanScore: dto.humanScore, humanPassed: dto.humanPassed, humanCefr: dto.humanCefr, notes: dto.notes?.trim() },
      });
      await this.persistHumanReviewOutcome(tx, attempt, reviewerId, dto, reviewedAt);
      return review;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  createQuestion(dto: CreateAssessmentQuestionDto) {
    return this.prisma.assessmentQuestion.create({ data: {
      category: dto.category, routeFamily: dto.routeFamily, difficulty: dto.difficulty,
      language: dto.language.toLowerCase(), questionType: dto.questionType, prompt: dto.prompt.trim(),
      responseOptions: dto.responseOptions as Prisma.InputJsonValue | undefined,
      answerKey: dto.answerKey as Prisma.InputJsonValue, scoringRubric: dto.scoringRubric as Prisma.InputJsonValue,
      sourceId: dto.sourceId,
    }, select: { id: true, category: true, routeFamily: true, difficulty: true, language: true, questionType: true, prompt: true, responseOptions: true, active: true, createdAt: true } });
  }

  private async persistKnowledgePreScreen(tx: Prisma.TransactionClient, attempt: AttemptWithResponses) {
    const scores = this.knowledgeScores(attempt);
    const normalizedScore = this.round(scores.totalScore * 2);
    await tx.guideKnowledgeAssessment.upsert({
      where: { assessmentAttemptId: attempt.id },
      create: {
        guideProfileId: attempt.guideProfileId,
        assessmentAttemptId: attempt.id,
        ...scores,
        pass: normalizedScore >= 70,
        evaluatorType: EvaluatorType.AI,
      },
      update: {
        ...scores,
        pass: normalizedScore >= 70,
        evaluatorType: EvaluatorType.AI,
      },
    });
    await this.persistCompetency(tx, attempt, {
      competencyType: GuideCompetencyType.GENERAL_KNOWLEDGE,
      competencyCode: 'GENERAL_KNOWLEDGE',
      score: normalizedScore,
      status: GuideCompetencyStatus.AI_PRE_SCREENED,
      verificationMethod: 'OBJECTIVE_PLATFORM_PRE_SCREEN',
      metadata: {
        rawCategoryScores: scores,
        rawMaximum: 50,
        rubricVersion: attempt.rubricVersion,
      },
    });
  }

  private async persistRoutePreScreen(tx: Prisma.TransactionClient, attempt: AttemptWithResponses, score: number) {
    if (!attempt.routeFamily) throw new ConflictException('Route assessment is missing routeFamily');
    await tx.guideRouteCompetency.upsert({
      where: { assessmentAttemptId: attempt.id },
      create: {
        guideProfileId: attempt.guideProfileId,
        routeId: attempt.routeId,
        assessmentAttemptId: attempt.id,
        routeFamily: attempt.routeFamily,
        score,
        status: GuideCompetencyStatus.AI_PRE_SCREENED,
        evaluatorType: EvaluatorType.AI,
      },
      update: {
        score,
        status: GuideCompetencyStatus.AI_PRE_SCREENED,
        passedAt: null,
        expiresAt: null,
        evaluatorType: EvaluatorType.AI,
      },
    });
  }

  private async persistAiSkillPreScore(userId: string, attemptId: string) {
    if (!this.ai) return null;
    const attempt = await this.prisma.assessmentAttempt.findFirst({
      where: {
        id: attemptId,
        userId,
        status: AssessmentAttemptStatus.SUBMITTED,
        assessmentType: { in: [AssessmentType.GUIDE_SKILL, AssessmentType.SAFETY_SCENARIO] },
      },
      include: { responses: { include: { question: true } } },
    });
    if (!attempt) return null;

    let evaluation: GuideResponseEvaluation;
    try {
      evaluation = await this.ai.evaluateGuideResponse(
        JSON.stringify(attempt.responses.map((response) => ({
          question: {
            category: response.question.category,
            questionType: response.question.questionType,
            prompt: response.question.prompt,
          },
          responseText: response.responseText,
          responsePayload: response.responsePayload,
        }))),
        {
          purpose: `${attempt.assessmentType} platform research pre-screen only`,
          scoreScale: 'Each dimension is scored from 0 to 100',
          dimensions: SKILL_WEIGHTS,
          safetyEmphasis: attempt.assessmentType === AssessmentType.SAFETY_SCENARIO,
          humanVerificationRequired: true,
        },
      );
    } catch {
      return null;
    }

    const breakdown = this.skillScores(evaluation.scores);
    const normalizedScore = this.round(breakdown.totalScore * 2);
    const confidence = this.clamp(evaluation.confidence, 0, 1);
    return this.prisma.$transaction(async (tx) => {
      const claimed = await tx.assessmentAttempt.updateMany({
        where: { id: attempt.id, userId, status: AssessmentAttemptStatus.SUBMITTED },
        data: {
          status: AssessmentAttemptStatus.AI_SCORED,
          score: normalizedScore,
          aiScore: normalizedScore,
          aiConfidence: confidence,
          passed: null,
        },
      });
      if (claimed.count !== 1) return null;
      await tx.guideSkillAssessment.upsert({
        where: { assessmentAttemptId: attempt.id },
        create: {
          guideProfileId: attempt.guideProfileId,
          assessmentAttemptId: attempt.id,
          ...breakdown,
          aiConfidence: confidence,
          humanReviewStatus: HumanReviewStatus.PENDING,
        },
        update: {
          ...breakdown,
          aiConfidence: confidence,
          humanReviewStatus: HumanReviewStatus.PENDING,
        },
      });
      await this.persistCompetency(tx, attempt, {
        competencyType: attempt.assessmentType === AssessmentType.GUIDE_SKILL
          ? GuideCompetencyType.GUIDE_SKILL
          : GuideCompetencyType.SAFETY,
        competencyCode: attempt.assessmentType,
        score: normalizedScore,
        status: GuideCompetencyStatus.AI_PRE_SCREENED,
        verificationMethod: 'STRUCTURED_AI_PRE_SCREEN',
        metadata: {
          rawSkillScores: breakdown,
          rawMaximum: 50,
          confidence,
          unsafeActions: evaluation.unsafeActions,
          feedback: evaluation.feedback,
          rubricVersion: attempt.rubricVersion,
        },
      });
      const updated = await tx.assessmentAttempt.findUniqueOrThrow({ where: { id: attempt.id } });
      return {
        ...updated,
        label: 'AI platform research pre-screening; human verification required',
        requiresHumanReview: true,
        aiFeedback: evaluation.feedback,
        unsafeActions: evaluation.unsafeActions,
      };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  private validateHumanReview(attempt: AssessmentAttempt, dto: HumanReviewDto) {
    const verified = dto.decision === AssessmentReviewDecision.VERIFIED;
    if (attempt.assessmentType === AssessmentType.LANGUAGE && !attempt.language) {
      throw new ConflictException('Language assessment is missing language');
    }
    if (attempt.assessmentType === AssessmentType.ROUTE_COMPETENCY && !attempt.routeFamily) {
      throw new ConflictException('Route assessment is missing routeFamily');
    }
    if (!verified) return;
    if (attempt.assessmentType === AssessmentType.LANGUAGE && !dto.humanCefr) {
      throw new ConflictException('Verified language review requires humanCefr');
    }
    if (
      attempt.assessmentType === AssessmentType.ROUTE_COMPETENCY ||
      attempt.assessmentType === AssessmentType.GUIDE_SKILL ||
      attempt.assessmentType === AssessmentType.SAFETY_SCENARIO
    ) {
      if (dto.humanScore === undefined || dto.humanPassed !== true) {
        throw new ConflictException('Verified competency review requires a human score and passing decision');
      }
    }
  }

  private async persistHumanReviewOutcome(
    tx: Prisma.TransactionClient,
    attempt: AssessmentAttempt,
    reviewerId: string,
    dto: HumanReviewDto,
    reviewedAt: Date,
  ) {
    if (attempt.assessmentType === AssessmentType.LANGUAGE) {
      await this.persistLanguageHumanReview(tx, attempt, reviewerId, dto);
      return;
    }
    if (attempt.assessmentType === AssessmentType.ROUTE_COMPETENCY) {
      await this.persistRouteHumanReview(tx, attempt, dto, reviewedAt);
      return;
    }
    if (attempt.assessmentType === AssessmentType.GUIDE_SKILL || attempt.assessmentType === AssessmentType.SAFETY_SCENARIO) {
      await this.persistSkillHumanReview(tx, attempt, reviewerId, dto, reviewedAt);
    }
  }

  private async persistLanguageHumanReview(
    tx: Prisma.TransactionClient,
    attempt: AssessmentAttempt,
    reviewerId: string,
    dto: HumanReviewDto,
  ) {
    const verified = dto.decision === AssessmentReviewDecision.VERIFIED;
    const status = verified ? GuideCompetencyStatus.HUMAN_VERIFIED : GuideCompetencyStatus.REJECTED;
    await tx.guideLanguageAssessment.upsert({
      where: { assessmentAttemptId: attempt.id },
      create: {
        guideProfileId: attempt.guideProfileId,
        assessmentAttemptId: attempt.id,
        language: attempt.language!,
        humanVerifiedCefr: verified ? dto.humanCefr : null,
        assessmentStatus: status,
        verifiedById: verified ? reviewerId : null,
      },
      update: {
        humanVerifiedCefr: verified ? dto.humanCefr : null,
        assessmentStatus: status,
        verifiedById: verified ? reviewerId : null,
      },
    });
  }

  private async persistRouteHumanReview(
    tx: Prisma.TransactionClient,
    attempt: AssessmentAttempt,
    dto: HumanReviewDto,
    reviewedAt: Date,
  ) {
    const verified = dto.decision === AssessmentReviewDecision.VERIFIED;
    const score = this.effectiveReviewScore(attempt, dto);
    const expiresAt = verified ? new Date(reviewedAt.getTime() + VERIFIED_ROUTE_VALIDITY_MS) : null;
    await tx.guideRouteCompetency.upsert({
      where: { assessmentAttemptId: attempt.id },
      create: {
        guideProfileId: attempt.guideProfileId,
        routeId: attempt.routeId,
        assessmentAttemptId: attempt.id,
        routeFamily: attempt.routeFamily!,
        score,
        status: verified ? GuideCompetencyStatus.HUMAN_VERIFIED : GuideCompetencyStatus.REJECTED,
        passedAt: verified ? reviewedAt : null,
        expiresAt,
        evaluatorType: EvaluatorType.HUMAN,
      },
      update: {
        score,
        status: verified ? GuideCompetencyStatus.HUMAN_VERIFIED : GuideCompetencyStatus.REJECTED,
        passedAt: verified ? reviewedAt : null,
        expiresAt,
        evaluatorType: EvaluatorType.HUMAN,
      },
    });
  }

  private async persistSkillHumanReview(
    tx: Prisma.TransactionClient,
    attempt: AssessmentAttempt,
    reviewerId: string,
    dto: HumanReviewDto,
    reviewedAt: Date,
  ) {
    const score = this.effectiveReviewScore(attempt, dto);
    const projected = this.projectSkillScores(score);
    const humanReviewStatus = this.humanReviewStatus(dto.decision);
    await tx.guideSkillAssessment.upsert({
      where: { assessmentAttemptId: attempt.id },
      create: {
        guideProfileId: attempt.guideProfileId,
        assessmentAttemptId: attempt.id,
        ...projected,
        aiConfidence: attempt.aiConfidence,
        humanReviewStatus,
      },
      update: {
        totalScore: projected.totalScore,
        humanReviewStatus,
      },
    });
    const verified = dto.decision === AssessmentReviewDecision.VERIFIED;
    await this.persistCompetency(tx, attempt, {
      competencyType: attempt.assessmentType === AssessmentType.GUIDE_SKILL
        ? GuideCompetencyType.GUIDE_SKILL
        : GuideCompetencyType.SAFETY,
      competencyCode: attempt.assessmentType,
      score,
      status: verified ? GuideCompetencyStatus.HUMAN_VERIFIED : GuideCompetencyStatus.REJECTED,
      verifiedById: verified ? reviewerId : null,
      verificationMethod: 'HUMAN_REVIEW',
      validFrom: verified ? reviewedAt : null,
      metadata: { humanReviewDecision: dto.decision },
    });
  }

  private async persistCompetency(
    tx: Prisma.TransactionClient,
    attempt: Pick<AssessmentAttempt, 'id' | 'guideProfileId'>,
    data: {
      competencyType: GuideCompetencyType;
      competencyCode: string;
      score: number;
      status: GuideCompetencyStatus;
      verifiedById?: string | null;
      verificationMethod: string;
      validFrom?: Date | null;
      validTo?: Date | null;
      metadata: Prisma.InputJsonValue;
    },
  ) {
    const updated = await tx.guideCompetency.updateMany({
      where: { assessmentAttemptId: attempt.id, competencyType: data.competencyType },
      data: {
        competencyCode: data.competencyCode,
        score: data.score,
        status: data.status,
        verifiedById: data.verifiedById ?? null,
        verificationMethod: data.verificationMethod,
        validFrom: data.validFrom ?? null,
        validTo: data.validTo ?? null,
        metadata: data.metadata,
      },
    });
    if (updated.count > 0) return;
    await tx.guideCompetency.create({
      data: {
        guideProfileId: attempt.guideProfileId,
        assessmentAttemptId: attempt.id,
        competencyType: data.competencyType,
        competencyCode: data.competencyCode,
        score: data.score,
        status: data.status,
        verifiedById: data.verifiedById,
        verificationMethod: data.verificationMethod,
        validFrom: data.validFrom,
        validTo: data.validTo,
        metadata: data.metadata,
      },
    });
  }

  private knowledgeScores(attempt: AttemptWithResponses) {
    const scoreFor = (category: keyof typeof KNOWLEDGE_WEIGHTS) => {
      const responses = attempt.responses.filter((response) => response.question.category === category);
      if (!responses.length) return 0;
      const correct = responses.filter((response) => this.isCorrect(response.question.answerKey, response.responsePayload, response.responseText)).length;
      return this.round((correct / responses.length) * KNOWLEDGE_WEIGHTS[category]);
    };
    const scores = {
      historyScore: scoreFor(AssessmentCategory.HISTORY_ARCHAEOLOGY),
      cultureScore: scoreFor(AssessmentCategory.RELIGION_CULTURE),
      geographyNatureScore: scoreFor(AssessmentCategory.GEOGRAPHY_NATURE),
      lawEthicsScore: scoreFor(AssessmentCategory.LAW_ETHICS),
      societyEconomyScore: scoreFor(AssessmentCategory.SOCIETY_ECONOMY),
    };
    return { ...scores, totalScore: this.round(Object.values(scores).reduce((total, value) => total + value, 0)) };
  }

  private skillScores(scores: Record<string, number>): SkillBreakdown {
    const weighted = (dimension: keyof typeof SKILL_WEIGHTS) => this.round(
      (this.clamp(scores[dimension] ?? 0, 0, 100) / 100) * SKILL_WEIGHTS[dimension],
    );
    const breakdown = {
      communicationScore: weighted('communication'),
      guidingTechniqueScore: weighted('guidingTechnique'),
      explanationStructureScore: weighted('explanationStructure'),
      factualPresentationScore: weighted('factualPresentation'),
      groupCareScore: weighted('groupCare'),
      questionHandlingScore: weighted('questionHandling'),
      professionalismScore: weighted('professionalism'),
    };
    return { ...breakdown, totalScore: this.round(Object.values(breakdown).reduce((total, value) => total + value, 0)) };
  }

  private projectSkillScores(score: number): SkillBreakdown {
    const percentage = this.clamp(score, 0, 100) / 100;
    return this.skillScores(Object.fromEntries(Object.keys(SKILL_WEIGHTS).map((dimension) => [dimension, percentage * 100])));
  }

  private effectiveReviewScore(attempt: AssessmentAttempt, dto: HumanReviewDto) {
    if (dto.humanScore !== undefined) return this.round(dto.humanScore);
    return this.round(Number(attempt.aiScore ?? attempt.score ?? 0));
  }

  private humanReviewStatus(decision: AssessmentReviewDecision) {
    if (decision === AssessmentReviewDecision.VERIFIED) return HumanReviewStatus.VERIFIED;
    if (decision === AssessmentReviewDecision.REASSESSMENT_REQUIRED) return HumanReviewStatus.REASSESSMENT_REQUIRED;
    return HumanReviewStatus.REJECTED;
  }

  private hasResponse(
    questionType: AssessmentQuestionType,
    responseText?: string | null,
    responsePayload?: unknown,
    audioReference?: string | null,
  ) {
    const hasText = !!responseText?.trim();
    const hasAudio = !!audioReference?.trim();
    const hasPayload = !!responsePayload && typeof responsePayload === 'object' && (
      Array.isArray(responsePayload)
        ? responsePayload.length > 0
        : Object.values(responsePayload).some((value) => value !== null && value !== undefined && (typeof value !== 'string' || !!value.trim()))
    );
    if (questionType === AssessmentQuestionType.MULTIPLE_CHOICE) return hasText || hasPayload;
    if (questionType === AssessmentQuestionType.SPEAKING_TASK) return hasText || hasAudio;
    return hasText || hasPayload;
  }

  private clamp(value: number, minimum: number, maximum: number) {
    return Math.max(minimum, Math.min(maximum, Number.isFinite(value) ? value : minimum));
  }

  private round(value: number) { return Math.round(value * 100) / 100; }
  private isUniqueConstraint(error: unknown) { return !!error && typeof error === 'object' && 'code' in error && error.code === 'P2002'; }

  private async guideForUser(userId: string) { const guide = await this.prisma.guideProfile.findUnique({ where: { userId }, select: { id: true } }); if (!guide) throw new NotFoundException('Guide profile not found'); return guide; }
  private questionIds(metadata: Prisma.JsonValue): string[] { if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return []; const ids = (metadata as Record<string, unknown>).questionIds; return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : []; }
  private shuffle<T>(items: T[]) { const shuffled = [...items]; for (let index = shuffled.length - 1; index > 0; index -= 1) { const target = randomInt(index + 1); [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]]; } return shuffled; }
  private isCorrect(key: Prisma.JsonValue, payload: Prisma.JsonValue, text: string | null) { const answer = key && typeof key === 'object' && !Array.isArray(key) ? (key as Record<string, unknown>).correctOption : key; const supplied = payload && typeof payload === 'object' && !Array.isArray(payload) ? (payload as Record<string, unknown>).option : text; return String(supplied ?? '').trim().toLowerCase() === String(answer ?? '').trim().toLowerCase(); }
  private attemptSummarySelect() { return { id: true, assessmentType: true, routeFamily: true, language: true, status: true, score: true, aiScore: true, humanScore: true, passed: true, aiEstimatedCefr: true, humanCefr: true, startedAt: true, submittedAt: true, completedAt: true, createdAt: true } as const; }
}
