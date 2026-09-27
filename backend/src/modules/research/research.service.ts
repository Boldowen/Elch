import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import {
  EvaluatorType,
  Prisma,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateResearchEvaluationDto,
  ListResearchRunsDto,
} from './dto/research.dto.js';

interface ResearchEvaluationRow {
  id: string;
  reviewerId: string | null;
  evaluatorType: string;
  blindEvaluation: boolean;
  factualAccuracy: unknown;
  hallucinationDetected: boolean | null;
  poiValidity: unknown;
  spatialFeasibility: unknown;
  temporalFeasibility: unknown;
  budgetCompliance: unknown;
  seasonCompliance: unknown;
  safetyViolation: boolean | null;
  personalizationScore: unknown;
  aiScore: unknown;
  humanScore: unknown;
  aiPass: boolean | null;
  humanPass: boolean | null;
  aiCefr: string | null;
  humanCefr: string | null;
  safetyFalseNegative: boolean | null;
  safetyFalsePositive: boolean | null;
}

interface ResearchRunRow {
  id: string;
  userId: string | null;
  conversationId: string | null;
  routeId: string | null;
  experimentMode: string;
  requestType: string;
  provider: string;
  model: string;
  promptVersion: string;
  routeFamily: string | null;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  estimatedCost: unknown;
  toolCalls: Prisma.JsonValue;
  validatorResult: Prisma.JsonValue;
  finalValidity: boolean | null;
  failureReason: string | null;
  createdAt: Date;
  evaluationResults?: ResearchEvaluationRow[];
  _count?: { evaluationResults: number };
}

const assessmentExportSelect = {
  id: true,
  userId: true,
  guideProfileId: true,
  routeId: true,
  routeFamily: true,
  assessmentType: true,
  status: true,
  score: true,
  aiScore: true,
  humanScore: true,
  passed: true,
  humanPassed: true,
  aiEstimatedCefr: true,
  humanCefr: true,
  aiConfidence: true,
  createdAt: true,
} satisfies Prisma.AssessmentAttemptSelect;
type AssessmentExportRow = Prisma.AssessmentAttemptGetPayload<{
  select: typeof assessmentExportSelect;
}>;

const languageExportSelect = {
  id: true,
  guideProfileId: true,
  assessmentAttemptId: true,
  language: true,
  aiEstimatedCefr: true,
  aiConfidence: true,
  fluencyScore: true,
  grammarScore: true,
  vocabularyScore: true,
  interactionScore: true,
  clarityScore: true,
  humanVerifiedCefr: true,
  assessmentStatus: true,
  createdAt: true,
} satisfies Prisma.GuideLanguageAssessmentSelect;
type LanguageExportRow = Prisma.GuideLanguageAssessmentGetPayload<{
  select: typeof languageExportSelect;
}>;

const competencyExportSelect = {
  id: true,
  guideProfileId: true,
  routeId: true,
  assessmentAttemptId: true,
  competencyType: true,
  competencyCode: true,
  score: true,
  status: true,
  verifiedById: true,
  verificationMethod: true,
  validFrom: true,
  validTo: true,
  createdAt: true,
} satisfies Prisma.GuideCompetencySelect;
type CompetencyExportRow = Prisma.GuideCompetencyGetPayload<{
  select: typeof competencyExportSelect;
}>;

const routeCompetencyExportSelect = {
  id: true,
  guideProfileId: true,
  routeId: true,
  assessmentAttemptId: true,
  routeFamily: true,
  score: true,
  status: true,
  passedAt: true,
  expiresAt: true,
  evaluatorType: true,
  createdAt: true,
} satisfies Prisma.GuideRouteCompetencySelect;
type RouteCompetencyExportRow = Prisma.GuideRouteCompetencyGetPayload<{
  select: typeof routeCompetencyExportSelect;
}>;

const firstAidExportSelect = {
  id: true,
  guideProfileId: true,
  assessmentAttemptId: true,
  issuedAt: true,
  expiresAt: true,
  certificateStatus: true,
  theoryScore: true,
  practicalVerificationStatus: true,
  verifiedAt: true,
  verifiedById: true,
  createdAt: true,
} satisfies Prisma.GuideFirstAidSelect;
type FirstAidExportRow = Prisma.GuideFirstAidGetPayload<{
  select: typeof firstAidExportSelect;
}>;

const guideMatchExportSelect = {
  id: true,
  userId: true,
  routeId: true,
  experimentRunId: true,
  routeFamily: true,
  requestedStartAt: true,
  requestedEndAt: true,
  language: true,
  minimumCefr: true,
  createdAt: true,
  results: {
    orderBy: [{ eligible: 'desc' as const }, { rank: 'asc' as const }, { id: 'asc' as const }],
    take: 101,
    select: {
      id: true,
      guideProfileId: true,
      eligible: true,
      score: true,
      rank: true,
      hardGateFailures: true,
      factors: true,
    },
  },
} satisfies Prisma.GuideMatchRunSelect;
type GuideMatchExportRow = Prisma.GuideMatchRunGetPayload<{
  select: typeof guideMatchExportSelect;
}>;

export interface ResearchExport {
  filename: string;
  contentType: string;
  body: string;
  rowCount: number;
  truncated: boolean;
}

const EXPORT_FIELDS = [
  'record_type',
  'subject_id',
  'run_id',
  'user_id',
  'conversation_id',
  'route_id',
  'attempt_id',
  'guide_id',
  'match_run_id',
  'match_result_id',
  'evaluation_id',
  'reviewer_id',
  'experiment_mode',
  'request_type',
  'provider',
  'model',
  'prompt_version',
  'route_family',
  'input_tokens',
  'output_tokens',
  'latency_ms',
  'estimated_cost_usd',
  'tool_calls',
  'validator_valid',
  'validation_codes',
  'final_validity',
  'failure_reason',
  'created_at',
  'evaluator_type',
  'blind_evaluation',
  'factual_accuracy',
  'hallucination_detected',
  'poi_validity',
  'spatial_feasibility',
  'temporal_feasibility',
  'budget_compliance',
  'season_compliance',
  'safety_violation',
  'personalization_score',
  'ai_score',
  'human_score',
  'ai_pass',
  'human_pass',
  'ai_cefr',
  'human_cefr',
  'safety_false_negative',
  'safety_false_positive',
  'assessment_type',
  'assessment_status',
  'score',
  'ai_confidence',
  'language',
  'fluency_score',
  'grammar_score',
  'vocabulary_score',
  'interaction_score',
  'clarity_score',
  'competency_type',
  'competency_code',
  'competency_status',
  'verification_method',
  'valid_from',
  'valid_to',
  'expires_at',
  'certificate_status',
  'practical_verification_status',
  'theory_score',
  'requested_start_at',
  'requested_end_at',
  'minimum_cefr',
  'eligible',
  'rank',
  'hard_gate_failures',
  'factor_scores',
] as const;

type ExportField = (typeof EXPORT_FIELDS)[number];
type ExportRow = Record<ExportField, string | number | boolean | null>;

@Injectable()
export class ResearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async summary() {
    const [
      aggregate,
      modeGroups,
      requestGroups,
      modelGroups,
      providerGroups,
      routeValidationFailures,
      humanEvaluationCount,
      guideAssessmentCount,
      failedRuns,
      pairedAssessmentRows,
      routeCompetencyGroups,
      languageEstimateGroups,
      firstAidGroups,
    ] = await Promise.all([
      this.prisma.aiExperimentRun.aggregate({
        _count: { _all: true },
        _sum: { inputTokens: true, outputTokens: true, estimatedCost: true },
        _avg: { latencyMs: true },
      }),
      this.prisma.aiExperimentRun.groupBy({
        by: ['experimentMode'],
        _count: { _all: true },
        orderBy: { experimentMode: 'asc' },
      }),
      this.prisma.aiExperimentRun.groupBy({
        by: ['requestType'],
        _count: { _all: true },
        orderBy: { requestType: 'asc' },
      }),
      this.prisma.aiExperimentRun.groupBy({
        by: ['model'],
        _count: { _all: true },
        orderBy: { model: 'asc' },
      }),
      this.prisma.aiExperimentRun.groupBy({
        by: ['provider'],
        _count: { _all: true },
        orderBy: { provider: 'asc' },
      }),
      this.prisma.aiExperimentRun.count({ where: { finalValidity: false } }),
      this.prisma.aiEvaluationResult.count({
        where: { evaluatorType: EvaluatorType.HUMAN },
      }),
      this.prisma.assessmentAttempt.count(),
      this.prisma.aiExperimentRun.findMany({
        where: { finalValidity: false },
        orderBy: { createdAt: 'desc' },
        take: 1000,
        select: { validatorResult: true, failureReason: true },
      }),
      this.prisma.assessmentAttempt.findMany({
        where: { aiScore: { not: null }, humanScore: { not: null } },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 10_001,
        select: { aiScore: true, humanScore: true },
      }),
      this.prisma.guideRouteCompetency.groupBy({
        by: ['routeFamily', 'status'],
        _count: { _all: true },
        orderBy: [{ routeFamily: 'asc' }, { status: 'asc' }],
      }),
      this.prisma.guideLanguageAssessment.groupBy({
        by: ['aiEstimatedCefr'],
        where: { aiEstimatedCefr: { not: null } },
        _count: { _all: true },
        orderBy: { aiEstimatedCefr: 'asc' },
      }),
      this.prisma.guideFirstAid.groupBy({
        by: ['certificateStatus', 'practicalVerificationStatus'],
        _count: { _all: true },
        orderBy: [
          { certificateStatus: 'asc' },
          { practicalVerificationStatus: 'asc' },
        ],
      }),
    ]);

    const errors = new Map<string, number>();
    for (const run of failedRuns) {
      const codes = this.validationCodes(run.validatorResult);
      if (!codes.length && run.failureReason) {
        codes.push(this.safeFailureReason(run.failureReason));
      }
      for (const code of codes) errors.set(code, (errors.get(code) ?? 0) + 1);
    }
    const pairedScores = pairedAssessmentRows.slice(0, 10_000).flatMap((row) => {
      const aiScore = this.nullableDecimal(row.aiScore);
      const humanScore = this.nullableDecimal(row.humanScore);
      return aiScore === null || humanScore === null ? [] : [{ aiScore, humanScore }];
    });

    return {
      totalAiRequests: aggregate._count._all,
      experimentModeDistribution: this.distribution(
        modeGroups,
        'experimentMode',
      ),
      requestTypeDistribution: this.distribution(requestGroups, 'requestType'),
      modelUsage: this.distribution(modelGroups, 'model'),
      providerUsage: this.distribution(providerGroups, 'provider'),
      totalInputTokens: aggregate._sum.inputTokens ?? 0,
      totalOutputTokens: aggregate._sum.outputTokens ?? 0,
      estimatedAiCost: this.decimal(aggregate._sum.estimatedCost),
      averageLatencyMs: this.decimal(aggregate._avg.latencyMs),
      routeValidationFailures,
      commonValidationErrors: [...errors.entries()]
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .slice(0, 20)
        .map(([code, count]) => ({ code, count })),
      guideAssessmentCount,
      humanEvaluationCount,
      aiVsHumanScoreComparison: {
        ...this.scoreComparison(pairedScores),
        truncated: pairedAssessmentRows.length > 10_000,
      },
      routeCompetencyDistribution: routeCompetencyGroups.map((row) => ({
        label: `${row.routeFamily}:${row.status}`,
        count: row._count._all,
      })),
      languageEstimateDistribution: languageEstimateGroups.map((row) => ({
        label: row.aiEstimatedCefr ?? 'NOT_ESTIMATED',
        count: row._count._all,
      })),
      firstAidVerificationDistribution: firstAidGroups.map((row) => ({
        label: `${row.certificateStatus}:${row.practicalVerificationStatus}`,
        count: row._count._all,
      })),
      generatedAt: new Date().toISOString(),
    };
  }

  async runs(query: ListResearchRunsDto) {
    const limit = query.limit ?? 50;
    const where: Prisma.AiExperimentRunWhereInput = {
      experimentMode: query.experimentMode,
      requestType: query.requestType,
      routeFamily: query.routeFamily,
      ...(query.from || query.to
        ? {
            createdAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };
    const rows = await this.prisma.aiExperimentRun.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      select: {
        id: true,
        experimentMode: true,
        requestType: true,
        provider: true,
        model: true,
        promptVersion: true,
        routeFamily: true,
        inputTokens: true,
        outputTokens: true,
        latencyMs: true,
        estimatedCost: true,
        toolCalls: true,
        validatorResult: true,
        finalValidity: true,
        failureReason: true,
        createdAt: true,
        _count: { select: { evaluationResults: true } },
      },
    });
    const hasMore = rows.length > limit;
    const page = rows.slice(0, limit) as unknown as ResearchRunRow[];
    return {
      data: page.map((run) => this.publicRun(run)),
      nextCursor: hasMore ? page.at(-1)?.id ?? null : null,
    };
  }

  async addEvaluation(
    reviewerId: string,
    experimentRunId: string,
    dto: CreateResearchEvaluationDto,
  ) {
    const run = await this.prisma.aiExperimentRun.findUnique({
      where: { id: experimentRunId },
      select: {
        id: true,
        evaluationResults: {
          where: { evaluatorType: EvaluatorType.AI },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { aiScore: true, aiPass: true, aiCefr: true, safetyViolation: true },
        },
      },
    });
    if (!run) throw new NotFoundException('AI experiment run not found');
    const aiEvaluation = run.evaluationResults?.[0];
    const data = {
        experimentRunId,
        reviewerId,
        evaluatorType: EvaluatorType.HUMAN,
        blindEvaluation: true,
        factualAccuracy: dto.factualAccuracy,
        hallucinationDetected: dto.hallucinationDetected,
        poiValidity: dto.poiValidity,
        spatialFeasibility: dto.spatialFeasibility,
        temporalFeasibility: dto.temporalFeasibility,
        budgetCompliance: dto.budgetCompliance,
        seasonCompliance: dto.seasonCompliance,
        safetyViolation: dto.safetyViolation,
        personalizationScore: dto.personalizationScore,
        aiScore: aiEvaluation?.aiScore,
        humanScore: dto.humanScore,
        aiPass: aiEvaluation?.aiPass,
        humanPass: dto.humanPass,
        aiCefr: aiEvaluation?.aiCefr,
        humanCefr: dto.humanCefr,
        safetyFalseNegative:
          aiEvaluation?.safetyViolation === false && dto.safetyViolation === true,
        safetyFalsePositive:
          aiEvaluation?.safetyViolation === true && dto.safetyViolation === false,
        notes: dto.notes?.trim(),
      };
    return this.prisma.aiEvaluationResult.upsert({
      where: {
        experimentRunId_reviewerId_evaluatorType: {
          experimentRunId,
          reviewerId,
          evaluatorType: EvaluatorType.HUMAN,
        },
      },
      create: data,
      update: data,
      select: {
        id: true,
        experimentRunId: true,
        evaluatorType: true,
        blindEvaluation: true,
        factualAccuracy: true,
        hallucinationDetected: true,
        poiValidity: true,
        spatialFeasibility: true,
        temporalFeasibility: true,
        budgetCompliance: true,
        seasonCompliance: true,
        safetyViolation: true,
        personalizationScore: true,
        aiScore: true,
        humanScore: true,
        aiPass: true,
        humanPass: true,
        aiCefr: true,
        humanCefr: true,
        safetyFalseNegative: true,
        safetyFalsePositive: true,
        createdAt: true,
      },
    });
  }

  async exportData(format: 'json' | 'csv'): Promise<ResearchExport> {
    if (!this.config.get<boolean>('RESEARCH_EXPORT_ENABLED', true)) {
      throw new ForbiddenException('Research export is disabled');
    }
    const salt = this.config.get<string>('RESEARCH_EXPORT_SALT', '');
    if (salt.length < 16) {
      throw new ServiceUnavailableException(
        'RESEARCH_EXPORT_SALT must be configured with at least 16 characters',
      );
    }
    const maximumRowsPerDataset = 10_000;
    const [rawRuns, attempts, languages, competencies, routeCompetencies, firstAid, matchRuns] =
      await Promise.all([
        this.prisma.aiExperimentRun.findMany({
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take: maximumRowsPerDataset + 1,
          select: {
            id: true,
            userId: true,
            conversationId: true,
            routeId: true,
            experimentMode: true,
            requestType: true,
            provider: true,
            model: true,
            promptVersion: true,
            routeFamily: true,
            inputTokens: true,
            outputTokens: true,
            latencyMs: true,
            estimatedCost: true,
            toolCalls: true,
            validatorResult: true,
            finalValidity: true,
            failureReason: true,
            createdAt: true,
            evaluationResults: {
              orderBy: { createdAt: 'asc' },
              select: {
                id: true,
                reviewerId: true,
                evaluatorType: true,
                blindEvaluation: true,
                factualAccuracy: true,
                hallucinationDetected: true,
                poiValidity: true,
                spatialFeasibility: true,
                temporalFeasibility: true,
                budgetCompliance: true,
                seasonCompliance: true,
                safetyViolation: true,
                personalizationScore: true,
                aiScore: true,
                humanScore: true,
                aiPass: true,
                humanPass: true,
                aiCefr: true,
                humanCefr: true,
                safetyFalseNegative: true,
                safetyFalsePositive: true,
              },
            },
          },
        }),
        this.prisma.assessmentAttempt.findMany({
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take: maximumRowsPerDataset + 1,
          select: assessmentExportSelect,
        }),
        this.prisma.guideLanguageAssessment.findMany({
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take: maximumRowsPerDataset + 1,
          select: languageExportSelect,
        }),
        this.prisma.guideCompetency.findMany({
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take: maximumRowsPerDataset + 1,
          select: competencyExportSelect,
        }),
        this.prisma.guideRouteCompetency.findMany({
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take: maximumRowsPerDataset + 1,
          select: routeCompetencyExportSelect,
        }),
        this.prisma.guideFirstAid.findMany({
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take: maximumRowsPerDataset + 1,
          select: firstAidExportSelect,
        }),
        this.prisma.guideMatchRun.findMany({
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take: maximumRowsPerDataset + 1,
          select: guideMatchExportSelect,
        }),
      ]);
    const runs = rawRuns as unknown as ResearchRunRow[];
    const expandedRunRows = runs
      .slice(0, maximumRowsPerDataset)
      .flatMap((run) => this.exportRows(run, salt));
    const expandedMatchRows = matchRuns
      .slice(0, maximumRowsPerDataset)
      .flatMap((run) => this.guideMatchExportRows(run, salt));
    const rows = [
      ...expandedRunRows.slice(0, maximumRowsPerDataset),
      ...attempts.slice(0, maximumRowsPerDataset).map((row) => this.assessmentExportRow(row, salt)),
      ...languages.slice(0, maximumRowsPerDataset).map((row) => this.languageExportRow(row, salt)),
      ...competencies.slice(0, maximumRowsPerDataset).map((row) => this.competencyExportRow(row, salt)),
      ...routeCompetencies.slice(0, maximumRowsPerDataset).map((row) => this.routeCompetencyExportRow(row, salt)),
      ...firstAid.slice(0, maximumRowsPerDataset).map((row) => this.firstAidExportRow(row, salt)),
      ...expandedMatchRows.slice(0, maximumRowsPerDataset),
    ];
    const truncated = [runs, attempts, languages, competencies, routeCompetencies, firstAid, matchRuns]
      .some((dataset) => dataset.length > maximumRowsPerDataset) ||
      expandedRunRows.length > maximumRowsPerDataset ||
      expandedMatchRows.length > maximumRowsPerDataset ||
      matchRuns.some((run) => run.results.length > 100);
    const datasetCounts = this.datasetCounts(rows);
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === 'csv') {
      return {
        filename: `elch-research-${stamp}.csv`,
        contentType: 'text/csv; charset=utf-8',
        body: this.csv(rows),
        rowCount: rows.length,
        truncated,
      };
    }
    return {
      filename: `elch-research-${stamp}.json`,
      contentType: 'application/json; charset=utf-8',
      body: JSON.stringify(
        {
          schemaVersion: 'elch-research-export-v2',
          rowCount: rows.length,
          truncated,
          datasetCounts,
          fields: EXPORT_FIELDS,
          data: rows,
        },
        null,
        2,
      ),
      rowCount: rows.length,
      truncated,
    };
  }

  private publicRun(run: ResearchRunRow) {
    return {
      id: run.id,
      experimentMode: run.experimentMode,
      requestType: run.requestType,
      provider: run.provider,
      model: run.model,
      promptVersion: run.promptVersion,
      routeFamily: run.routeFamily,
      inputTokens: run.inputTokens,
      outputTokens: run.outputTokens,
      latencyMs: run.latencyMs,
      estimatedCost: this.decimal(run.estimatedCost),
      toolCalls: this.toolNames(run.toolCalls),
      validator: {
        valid: this.validatorValid(run.validatorResult),
        codes: this.validationCodes(run.validatorResult),
      },
      finalValidity: run.finalValidity,
      failureReason: run.failureReason
        ? this.safeFailureReason(run.failureReason)
        : null,
      evaluationCount: run._count?.evaluationResults ?? 0,
      createdAt: run.createdAt,
    };
  }

  private exportRows(run: ResearchRunRow, salt: string): ExportRow[] {
    const evaluations = run.evaluationResults?.length
      ? run.evaluationResults
      : [null];
    return evaluations.map((evaluation) => ({
      ...this.emptyExportRow('AI_EXPERIMENT_EVALUATION'),
      subject_id: this.pseudonym(
        evaluation ? 'evaluation' : 'run',
        evaluation?.id ?? run.id,
        salt,
      ),
      run_id: this.pseudonym('run', run.id, salt),
      user_id: this.pseudonym('user', run.userId, salt),
      conversation_id: this.pseudonym(
        'conversation',
        run.conversationId,
        salt,
      ),
      route_id: this.pseudonym('route', run.routeId, salt),
      evaluation_id: this.pseudonym('evaluation', evaluation?.id ?? null, salt),
      reviewer_id: this.pseudonym(
        'reviewer',
        evaluation?.reviewerId ?? null,
        salt,
      ),
      experiment_mode: run.experimentMode,
      request_type: run.requestType,
      provider: run.provider,
      model: run.model,
      prompt_version: run.promptVersion,
      route_family: run.routeFamily,
      input_tokens: run.inputTokens,
      output_tokens: run.outputTokens,
      latency_ms: run.latencyMs,
      estimated_cost_usd: this.decimal(run.estimatedCost),
      tool_calls: JSON.stringify(this.toolNames(run.toolCalls)),
      validator_valid: this.validatorValid(run.validatorResult),
      validation_codes: JSON.stringify(
        this.validationCodes(run.validatorResult),
      ),
      final_validity: run.finalValidity,
      failure_reason: run.failureReason
        ? this.safeFailureReason(run.failureReason)
        : null,
      created_at: run.createdAt.toISOString(),
      evaluator_type: evaluation?.evaluatorType ?? null,
      blind_evaluation: evaluation?.blindEvaluation ?? null,
      factual_accuracy: this.nullableDecimal(evaluation?.factualAccuracy),
      hallucination_detected: evaluation?.hallucinationDetected ?? null,
      poi_validity: this.nullableDecimal(evaluation?.poiValidity),
      spatial_feasibility: this.nullableDecimal(
        evaluation?.spatialFeasibility,
      ),
      temporal_feasibility: this.nullableDecimal(
        evaluation?.temporalFeasibility,
      ),
      budget_compliance: this.nullableDecimal(evaluation?.budgetCompliance),
      season_compliance: this.nullableDecimal(evaluation?.seasonCompliance),
      safety_violation: evaluation?.safetyViolation ?? null,
      personalization_score: this.nullableDecimal(
        evaluation?.personalizationScore,
      ),
      ai_score: this.nullableDecimal(evaluation?.aiScore),
      human_score: this.nullableDecimal(evaluation?.humanScore),
      ai_pass: evaluation?.aiPass ?? null,
      human_pass: evaluation?.humanPass ?? null,
      ai_cefr: evaluation?.aiCefr ?? null,
      human_cefr: evaluation?.humanCefr ?? null,
      safety_false_negative: evaluation?.safetyFalseNegative ?? null,
      safety_false_positive: evaluation?.safetyFalsePositive ?? null,
    }));
  }

  private assessmentExportRow(row: AssessmentExportRow, salt: string): ExportRow {
    return {
      ...this.emptyExportRow('GUIDE_ASSESSMENT'),
      subject_id: this.pseudonym('assessment', row.id, salt),
      attempt_id: this.pseudonym('assessment', row.id, salt),
      user_id: this.pseudonym('user', row.userId, salt),
      guide_id: this.pseudonym('guide', row.guideProfileId, salt),
      route_id: this.pseudonym('route', row.routeId, salt),
      route_family: row.routeFamily,
      assessment_type: row.assessmentType,
      assessment_status: row.status,
      score: this.nullableDecimal(row.score),
      ai_score: this.nullableDecimal(row.aiScore),
      human_score: this.nullableDecimal(row.humanScore),
      ai_pass: row.passed,
      human_pass: row.humanPassed,
      ai_cefr: row.aiEstimatedCefr,
      human_cefr: row.humanCefr,
      ai_confidence: this.nullableDecimal(row.aiConfidence),
      created_at: row.createdAt.toISOString(),
    };
  }

  private languageExportRow(row: LanguageExportRow, salt: string): ExportRow {
    return {
      ...this.emptyExportRow('GUIDE_LANGUAGE_ASSESSMENT'),
      subject_id: this.pseudonym('language-assessment', row.id, salt),
      attempt_id: this.pseudonym('assessment', row.assessmentAttemptId, salt),
      guide_id: this.pseudonym('guide', row.guideProfileId, salt),
      assessment_type: 'LANGUAGE',
      assessment_status: row.assessmentStatus,
      language: row.language,
      ai_cefr: row.aiEstimatedCefr,
      human_cefr: row.humanVerifiedCefr,
      ai_confidence: this.nullableDecimal(row.aiConfidence),
      fluency_score: this.nullableDecimal(row.fluencyScore),
      grammar_score: this.nullableDecimal(row.grammarScore),
      vocabulary_score: this.nullableDecimal(row.vocabularyScore),
      interaction_score: this.nullableDecimal(row.interactionScore),
      clarity_score: this.nullableDecimal(row.clarityScore),
      created_at: row.createdAt.toISOString(),
    };
  }

  private competencyExportRow(row: CompetencyExportRow, salt: string): ExportRow {
    return {
      ...this.emptyExportRow('GUIDE_COMPETENCY'),
      subject_id: this.pseudonym('competency', row.id, salt),
      attempt_id: this.pseudonym('assessment', row.assessmentAttemptId, salt),
      guide_id: this.pseudonym('guide', row.guideProfileId, salt),
      route_id: this.pseudonym('route', row.routeId, salt),
      reviewer_id: this.pseudonym('reviewer', row.verifiedById, salt),
      score: this.nullableDecimal(row.score),
      competency_type: row.competencyType,
      competency_code: this.safeCompetencyCode(
        row.competencyCode,
        row.competencyType,
      ),
      competency_status: row.status,
      verification_method: row.verificationMethod,
      valid_from: this.iso(row.validFrom),
      valid_to: this.iso(row.validTo),
      created_at: row.createdAt.toISOString(),
    };
  }

  private routeCompetencyExportRow(
    row: RouteCompetencyExportRow,
    salt: string,
  ): ExportRow {
    return {
      ...this.emptyExportRow('GUIDE_ROUTE_COMPETENCY'),
      subject_id: this.pseudonym('route-competency', row.id, salt),
      attempt_id: this.pseudonym('assessment', row.assessmentAttemptId, salt),
      guide_id: this.pseudonym('guide', row.guideProfileId, salt),
      route_id: this.pseudonym('route', row.routeId, salt),
      route_family: row.routeFamily,
      evaluator_type: row.evaluatorType,
      score: this.nullableDecimal(row.score),
      competency_type: 'ROUTE_SPECIFIC',
      competency_status: row.status,
      valid_from: this.iso(row.passedAt),
      valid_to: this.iso(row.expiresAt),
      expires_at: this.iso(row.expiresAt),
      created_at: row.createdAt.toISOString(),
    };
  }

  private firstAidExportRow(row: FirstAidExportRow, salt: string): ExportRow {
    return {
      ...this.emptyExportRow('GUIDE_FIRST_AID'),
      subject_id: this.pseudonym('first-aid', row.id, salt),
      attempt_id: this.pseudonym('assessment', row.assessmentAttemptId, salt),
      guide_id: this.pseudonym('guide', row.guideProfileId, salt),
      reviewer_id: this.pseudonym('reviewer', row.verifiedById, salt),
      score: this.nullableDecimal(row.theoryScore),
      competency_type: 'FIRST_AID_THEORY',
      certificate_status: row.certificateStatus,
      practical_verification_status: row.practicalVerificationStatus,
      theory_score: this.nullableDecimal(row.theoryScore),
      valid_from: this.iso(row.issuedAt),
      valid_to: this.iso(row.expiresAt),
      expires_at: this.iso(row.expiresAt),
      created_at: row.createdAt.toISOString(),
    };
  }

  private guideMatchExportRows(row: GuideMatchExportRow, salt: string): ExportRow[] {
    const results = row.results.length ? row.results.slice(0, 100) : [null];
    return results.map((result) => ({
      ...this.emptyExportRow('GUIDE_MATCH_OUTCOME'),
      subject_id: this.pseudonym(
        result ? 'match-result' : 'match-run',
        result?.id ?? row.id,
        salt,
      ),
      run_id: this.pseudonym('run', row.experimentRunId, salt),
      user_id: this.pseudonym('user', row.userId, salt),
      route_id: this.pseudonym('route', row.routeId, salt),
      guide_id: this.pseudonym('guide', result?.guideProfileId ?? null, salt),
      match_run_id: this.pseudonym('match-run', row.id, salt),
      match_result_id: this.pseudonym('match-result', result?.id ?? null, salt),
      route_family: row.routeFamily,
      language: row.language,
      minimum_cefr: row.minimumCefr,
      requested_start_at: this.iso(row.requestedStartAt),
      requested_end_at: this.iso(row.requestedEndAt),
      eligible: result?.eligible ?? null,
      score: this.nullableDecimal(result?.score),
      rank: result?.rank ?? null,
      hard_gate_failures: result
        ? JSON.stringify(this.safeMatchFailures(result.hardGateFailures))
        : '[]',
      factor_scores: result
        ? JSON.stringify(this.safeMatchFactors(result.factors))
        : '{}',
      created_at: row.createdAt.toISOString(),
    }));
  }

  private emptyExportRow(recordType: string): ExportRow {
    const row = Object.fromEntries(
      EXPORT_FIELDS.map((field) => [field, null]),
    ) as ExportRow;
    row.record_type = recordType;
    return row;
  }

  private datasetCounts(rows: ExportRow[]) {
    const counts: Record<string, number> = {};
    for (const row of rows) {
      const type = String(row.record_type ?? 'UNKNOWN');
      counts[type] = (counts[type] ?? 0) + 1;
    }
    return counts;
  }

  private distribution<T extends Record<string, unknown>>(
    rows: T[],
    field: keyof T,
  ) {
    return rows.map((row) => ({
      value: String(row[field]),
      count:
        typeof row._count === 'object' &&
        row._count !== null &&
        '_all' in row._count &&
        typeof row._count._all === 'number'
          ? row._count._all
          : 0,
    }));
  }

  private toolNames(value: Prisma.JsonValue): string[] {
    if (!Array.isArray(value)) return [];
    return value.slice(0, 50).flatMap((item) => {
      if (typeof item === 'string') {
        return this.safeToolName(item) ? [item] : [];
      }
      if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
      const name = (item as Record<string, Prisma.JsonValue>).name;
      return typeof name === 'string' && this.safeToolName(name) ? [name] : [];
    });
  }

  private validationCodes(value: Prisma.JsonValue): string[] {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
    const source = value as Record<string, Prisma.JsonValue>;
    const raw = Array.isArray(source.violations)
      ? source.violations
      : Array.isArray(source.issues)
        ? source.issues
        : [];
    return [...new Set(raw.flatMap((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
      const entry = item as Record<string, Prisma.JsonValue>;
      const candidate =
        typeof entry.code === 'string'
          ? entry.code
          : typeof entry.rule === 'string'
            ? entry.rule
            : '';
      const code = candidate.trim().toUpperCase();
      return /^[A-Z][A-Z0-9_:-]{0,79}$/.test(code) ? [code] : [];
    }))];
  }

  private validatorValid(value: Prisma.JsonValue): boolean | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const valid = (value as Record<string, Prisma.JsonValue>).valid;
    return typeof valid === 'boolean' ? valid : null;
  }

  private safeFailureReason(value: string): string {
    const normalized = value.trim().toUpperCase();
    return /^[A-Z][A-Z0-9_:-]{0,79}$/.test(normalized)
      ? normalized
      : 'UNSTRUCTURED_FAILURE_REDACTED';
  }

  private safeToolName(value: string): boolean {
    return /^[A-Za-z][A-Za-z0-9_.:-]{0,79}$/.test(value);
  }

  private safeMatchFailures(value: Prisma.JsonValue): string[] {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.slice(0, 50).flatMap((item) => {
      if (typeof item !== 'string') return [];
      const code = item.trim().toUpperCase();
      if (/^[A-Z][A-Z0-9_]{0,79}$/.test(code)) return [code];
      return code.startsWith('SPECIALTY:') ? ['SPECIALTY_REQUIREMENT'] : [];
    }))];
  }

  private safeMatchFactors(value: Prisma.JsonValue): Record<string, number> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const allowed = new Set([
      'languageFit',
      'routeExpertise',
      'competency',
      'experience',
      'safety',
      'reliability',
    ]);
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key, item]) => allowed.has(key) && typeof item === 'number' && Number.isFinite(item))
        .map(([key, item]) => [key, item as number]),
    );
  }

  private safeCompetencyCode(value: string, type: string): string {
    const normalized = value.trim().toUpperCase();
    const allowed = new Set([
      'GENERAL_KNOWLEDGE',
      'GUIDE_SKILL',
      'LANGUAGE',
      'ROUTE_COMPETENCY',
      'FIRST_AID_THEORY',
      'SAFETY_SCENARIO',
    ]);
    if (allowed.has(normalized)) return normalized;
    return type === 'SPECIALTY' ? 'SPECIALTY_REDACTED' : 'CUSTOM_CODE_REDACTED';
  }

  private pseudonym(
    namespace: string,
    value: string | null,
    salt: string,
  ): string | null {
    if (!value) return null;
    const digest = createHmac('sha256', salt)
      .update(`${namespace}\0${value}`)
      .digest('hex');
    return `p_${digest.slice(0, 24)}`;
  }

  private iso(value: Date | null): string | null {
    return value?.toISOString() ?? null;
  }

  private csv(rows: ExportRow[]): string {
    const lines = [EXPORT_FIELDS.join(',')];
    for (const row of rows) {
      lines.push(EXPORT_FIELDS.map((field) => this.csvCell(row[field])).join(','));
    }
    return `${lines.join('\r\n')}\r\n`;
  }

  private csvCell(value: ExportRow[ExportField]): string {
    if (value === null) return '';
    let rendered = String(value);
    if (/^[=+\-@]/.test(rendered)) rendered = `'${rendered}`;
    return /[",\r\n]/.test(rendered)
      ? `"${rendered.replace(/"/g, '""')}"`
      : rendered;
  }

  private decimal(value: unknown): number {
    if (value === null || value === undefined) return 0;
    const number = Number(
      typeof value === 'object' && 'toString' in value
        ? value.toString()
        : value,
    );
    return Number.isFinite(number) ? number : 0;
  }

  private nullableDecimal(value: unknown): number | null {
    return value === null || value === undefined ? null : this.decimal(value);
  }

  private scoreComparison(rows: Array<{ aiScore: number; humanScore: number }>) {
    if (!rows.length) {
      return { aiAverage: null, humanAverage: null, correlation: null, sampleSize: 0 };
    }
    const sampleSize = rows.length;
    const aiAverage = rows.reduce((sum, row) => sum + row.aiScore, 0) / sampleSize;
    const humanAverage = rows.reduce((sum, row) => sum + row.humanScore, 0) / sampleSize;
    const covariance = rows.reduce(
      (sum, row) => sum + (row.aiScore - aiAverage) * (row.humanScore - humanAverage),
      0,
    );
    const aiVariance = rows.reduce(
      (sum, row) => sum + (row.aiScore - aiAverage) ** 2,
      0,
    );
    const humanVariance = rows.reduce(
      (sum, row) => sum + (row.humanScore - humanAverage) ** 2,
      0,
    );
    const denominator = Math.sqrt(aiVariance * humanVariance);
    return {
      aiAverage: this.roundMetric(aiAverage),
      humanAverage: this.roundMetric(humanAverage),
      correlation: denominator > 0 ? this.roundMetric(covariance / denominator) : null,
      sampleSize,
    };
  }

  private roundMetric(value: number) {
    return Math.round(value * 10_000) / 10_000;
  }
}
