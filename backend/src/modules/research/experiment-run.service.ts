import { Injectable } from '@nestjs/common';
import {
  AiExperimentMode,
  AiRequestType,
  Prisma,
  RouteFamily,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface ExperimentToolCall {
  name: string;
  status?: 'CALLED' | 'SUCCEEDED' | 'FAILED' | 'SKIPPED';
}

export interface ExperimentRunStartInput {
  userId?: string;
  conversationId?: string;
  routeId?: string;
  experimentMode: AiExperimentMode;
  requestType: AiRequestType;
  provider: string;
  model: string;
  promptVersion: string;
  routeFamily?: RouteFamily;
  metadata?: Record<string, unknown>;
}

export interface ExperimentRunCompletion {
  inputTokens?: number;
  outputTokens?: number;
  estimatedCost?: number;
  toolCalls?: Array<ExperimentToolCall | string | Record<string, unknown>>;
  validatorResult?: unknown;
  finalValidity?: boolean;
}

export interface ExperimentRunRecord extends ExperimentRunStartInput, ExperimentRunCompletion {
  latencyMs: number;
  failure?: unknown;
}

export interface ExperimentRunHandle {
  id: string;
  startedAtMs: number;
  safeMetadata: Record<string, string | number | boolean | null>;
}

const SAFE_METADATA_KEYS = new Set([
  'cacheHit',
  'experimentTrack',
  'legacyTrackId',
  'repairAttempts',
  'requestId',
  'retrievalCount',
  'sourceCount',
  'toolRounds',
]);

@Injectable()
export class ExperimentRunService {
  constructor(private readonly prisma: PrismaService) {}

  async start(input: ExperimentRunStartInput): Promise<ExperimentRunHandle> {
    const safeMetadata = this.sanitizeMetadata(input.metadata);
    const startedAtMs = Date.now();
    const run = await this.prisma.aiExperimentRun.create({
      data: {
        userId: input.userId,
        conversationId: input.conversationId,
        routeId: input.routeId,
        experimentMode: input.experimentMode,
        requestType: input.requestType,
        provider: this.safeLabel(input.provider, 'unknown-provider'),
        model: this.safeLabel(input.model, 'unknown-model'),
        promptVersion: this.safeLabel(input.promptVersion, 'unversioned'),
        routeFamily: input.routeFamily,
        latencyMs: 0,
        toolCalls: [],
        metadata: { lifecycle: 'STARTED', ...safeMetadata },
      },
      select: { id: true },
    });
    return { id: run.id, startedAtMs, safeMetadata };
  }

  complete(handle: ExperimentRunHandle, result: ExperimentRunCompletion = {}) {
    return this.prisma.aiExperimentRun.update({
      where: { id: handle.id },
      data: {
        inputTokens: this.nonNegativeInteger(result.inputTokens),
        outputTokens: this.nonNegativeInteger(result.outputTokens),
        latencyMs: Math.max(0, Date.now() - handle.startedAtMs),
        estimatedCost: this.nonNegativeNumber(result.estimatedCost),
        toolCalls: this.sanitizeToolCalls(result.toolCalls),
        ...(result.validatorResult === undefined
          ? {}
          : { validatorResult: this.sanitizeValidatorResult(result.validatorResult) }),
        finalValidity: result.finalValidity,
        failureReason: null,
        metadata: { lifecycle: 'COMPLETED', ...handle.safeMetadata },
      },
    });
  }

  fail(
    handle: ExperimentRunHandle,
    failure: unknown,
    result: Omit<ExperimentRunCompletion, 'finalValidity'> = {},
  ) {
    return this.prisma.aiExperimentRun.update({
      where: { id: handle.id },
      data: {
        inputTokens: this.nonNegativeInteger(result.inputTokens),
        outputTokens: this.nonNegativeInteger(result.outputTokens),
        latencyMs: Math.max(0, Date.now() - handle.startedAtMs),
        estimatedCost: this.nonNegativeNumber(result.estimatedCost),
        toolCalls: this.sanitizeToolCalls(result.toolCalls),
        ...(result.validatorResult === undefined
          ? {}
          : { validatorResult: this.sanitizeValidatorResult(result.validatorResult) }),
        finalValidity: false,
        failureReason: this.failureCode(failure),
        metadata: { lifecycle: 'FAILED', ...handle.safeMetadata },
      },
    });
  }

  record(input: ExperimentRunRecord) {
    const safeMetadata = this.sanitizeMetadata(input.metadata);
    return this.prisma.aiExperimentRun.create({
      data: {
        userId: input.userId,
        conversationId: input.conversationId,
        routeId: input.routeId,
        experimentMode: input.experimentMode,
        requestType: input.requestType,
        provider: this.safeLabel(input.provider, 'unknown-provider'),
        model: this.safeLabel(input.model, 'unknown-model'),
        promptVersion: this.safeLabel(input.promptVersion, 'unversioned'),
        routeFamily: input.routeFamily,
        inputTokens: this.nonNegativeInteger(input.inputTokens),
        outputTokens: this.nonNegativeInteger(input.outputTokens),
        latencyMs: this.nonNegativeInteger(input.latencyMs),
        estimatedCost: this.nonNegativeNumber(input.estimatedCost),
        toolCalls: this.sanitizeToolCalls(input.toolCalls),
        ...(input.validatorResult === undefined
          ? {}
          : { validatorResult: this.sanitizeValidatorResult(input.validatorResult) }),
        finalValidity: input.failure === undefined ? input.finalValidity : false,
        failureReason: input.failure === undefined ? null : this.failureCode(input.failure),
        metadata: {
          lifecycle: input.failure === undefined ? 'COMPLETED' : 'FAILED',
          ...safeMetadata,
        },
      },
    });
  }

  private sanitizeToolCalls(
    calls: ExperimentRunCompletion['toolCalls'],
  ): Prisma.InputJsonValue {
    if (!calls) return [];
    return calls.slice(0, 50).flatMap((call) => {
      if (typeof call === 'string') {
        const name = this.safeToolName(call);
        return name ? [{ name, status: 'CALLED' }] : [];
      }
      if (!call || typeof call !== 'object') return [];
      const candidate = call as Record<string, unknown>;
      const name = this.safeToolName(
        typeof candidate.name === 'string'
          ? candidate.name
          : typeof candidate.tool === 'string'
            ? candidate.tool
            : '',
      );
      if (!name) return [];
      const status =
        typeof candidate.status === 'string' &&
        ['CALLED', 'SUCCEEDED', 'FAILED', 'SKIPPED'].includes(
          candidate.status.toUpperCase(),
        )
          ? candidate.status.toUpperCase()
          : 'CALLED';
      return [{ name, status }];
    });
  }

  private sanitizeValidatorResult(value: unknown): Prisma.InputJsonValue {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return { recorded: false };
    }
    const source = value as Record<string, unknown>;
    const rawViolations = Array.isArray(source.violations)
      ? source.violations
      : Array.isArray(source.issues)
        ? source.issues
        : [];
    const violations = rawViolations.slice(0, 100).flatMap((violation) => {
      if (!violation || typeof violation !== 'object' || Array.isArray(violation)) {
        return [];
      }
      const item = violation as Record<string, unknown>;
      const codeValue =
        typeof item.code === 'string'
          ? item.code
          : typeof item.rule === 'string'
            ? item.rule
            : '';
      const code = this.safeCode(codeValue);
      if (!code) return [];
      const severity =
        typeof item.severity === 'string' &&
        ['ERROR', 'WARNING', 'INFO'].includes(item.severity.toUpperCase())
          ? item.severity.toUpperCase()
          : 'ERROR';
      return [{ code, severity }];
    });
    return {
      recorded: true,
      ...(typeof source.valid === 'boolean' ? { valid: source.valid } : {}),
      violations,
    };
  }

  private sanitizeMetadata(
    value?: Record<string, unknown>,
  ): Record<string, string | number | boolean | null> {
    if (!value) return {};
    const safe: Record<string, string | number | boolean | null> = {};
    for (const [key, item] of Object.entries(value)) {
      if (!SAFE_METADATA_KEYS.has(key)) continue;
      if (item === null || typeof item === 'boolean') safe[key] = item;
      else if (typeof item === 'number' && Number.isFinite(item)) safe[key] = item;
      else if (typeof item === 'string') safe[key] = item.slice(0, 120);
    }
    return safe;
  }

  private safeLabel(value: string, fallback: string): string {
    const normalized = value.trim().replace(/[\r\n\t]+/g, ' ').slice(0, 200);
    if (!normalized || /(?:bearer\s+|sk-[a-z0-9_-]{8,})/i.test(normalized)) {
      return fallback;
    }
    return normalized;
  }

  private safeToolName(value: string): string | null {
    const normalized = value.trim();
    return /^[A-Za-z][A-Za-z0-9_.:-]{0,79}$/.test(normalized)
      ? normalized
      : null;
  }

  private safeCode(value: string): string | null {
    const normalized = value.trim().toUpperCase();
    return /^[A-Z][A-Z0-9_:-]{0,79}$/.test(normalized)
      ? normalized
      : null;
  }

  private failureCode(failure: unknown): string {
    if (typeof failure === 'string') {
      return this.safeCode(failure) ?? 'AI_REQUEST_FAILED';
    }
    if (failure && typeof failure === 'object') {
      const candidate = failure as { code?: unknown; name?: unknown };
      if (typeof candidate.code === 'string') {
        const code = this.safeCode(candidate.code);
        if (code) return code;
      }
      if (typeof candidate.name === 'string') {
        const converted = candidate.name
          .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
          .toUpperCase();
        const code = this.safeCode(converted);
        if (code) return code;
      }
    }
    return 'AI_REQUEST_FAILED';
  }

  private nonNegativeInteger(value?: number): number {
    return Number.isFinite(value) ? Math.max(0, Math.trunc(value ?? 0)) : 0;
  }

  private nonNegativeNumber(value?: number): number {
    return Number.isFinite(value) ? Math.max(0, value ?? 0) : 0;
  }
}
