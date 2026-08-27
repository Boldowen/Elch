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

export interface ResearchExport {
  filename: string;
  contentType: string;
  body: string;
  rowCount: number;
  truncated: boolean;
}

const EXPORT_FIELDS = [
  'run_id',
  'user_id',
  'conversation_id',
  'route_id',
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
    ]);

    const errors = new Map<string, number>();
    for (const run of failedRuns) {
      const codes = this.validationCodes(run.validatorResult);
      if (!codes.length && run.failureReason) {
        codes.push(this.safeFailureReason(run.failureReason));
      }
      for (const code of codes) errors.set(code, (errors.get(code) ?? 0) + 1);
    }

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
    const maximumRows = 50_000;
    const runs = (await this.prisma.aiExperimentRun.findMany({
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      take: maximumRows + 1,
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
    })) as unknown as ResearchRunRow[];
    const truncated = runs.length > maximumRows;
    const rows = runs
      .slice(0, maximumRows)
      .flatMap((run) => this.exportRows(run, salt));
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
          schemaVersion: 'elch-research-export-v1',
          rowCount: rows.length,
          truncated,
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
}
