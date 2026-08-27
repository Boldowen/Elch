import { ConfigService } from '@nestjs/config';
import { jest } from '@jest/globals';
import {
  AiExperimentMode,
  AiRequestType,
  EvaluatorType,
  RouteFamily,
} from '../src/generated/prisma/client.js';
import { ExperimentRunService } from '../src/modules/research/experiment-run.service.js';
import { ResearchService } from '../src/modules/research/research.service.js';

function createPrismaMock() {
  return {
    aiExperimentRun: {
      aggregate: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      groupBy: jest.fn(),
      update: jest.fn(),
    },
    aiEvaluationResult: {
      count: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
    },
    assessmentAttempt: {
      count: jest.fn(),
    },
  };
}

describe('ExperimentRunService', () => {
  it('records only whitelisted metadata, tool names, validator codes, and safe failure codes', async () => {
    const prisma = createPrismaMock();
    prisma.aiExperimentRun.create.mockResolvedValue({ id: 'run-id' });
    const service = new ExperimentRunService(prisma as never);

    await service.record({
      userId: 'user-id',
      experimentMode: AiExperimentMode.E,
      requestType: AiRequestType.ITINERARY,
      provider: 'local',
      model: 'research-model',
      promptVersion: 'prompt-v1',
      routeFamily: RouteFamily.GOBI,
      inputTokens: 10,
      outputTokens: 20,
      latencyMs: 42,
      toolCalls: [
        { name: 'searchGuides', status: 'SUCCEEDED', args: { email: 'private@example.test' } },
        { tool: 'validateRoute', result: 'private route result' },
      ],
      validatorResult: {
        valid: false,
        violations: [
          {
            code: 'GUIDE_REQUIRED',
            severity: 'ERROR',
            message: 'Private traveler details',
          },
        ],
      },
      metadata: {
        requestId: 'request-safe',
        repairAttempts: 1,
        email: 'private@example.test',
        rawPrompt: 'secret prompt',
      },
      failure: new Error('provider response contained a secret'),
    });

    const data = prisma.aiExperimentRun.create.mock.calls[0][0].data;
    const serialized = JSON.stringify(data);
    expect(data.toolCalls).toEqual([
      { name: 'searchGuides', status: 'SUCCEEDED' },
      { name: 'validateRoute', status: 'CALLED' },
    ]);
    expect(data.validatorResult).toEqual({
      recorded: true,
      valid: false,
      violations: [{ code: 'GUIDE_REQUIRED', severity: 'ERROR' }],
    });
    expect(data.metadata).toEqual({
      lifecycle: 'FAILED',
      requestId: 'request-safe',
      repairAttempts: 1,
    });
    expect(data.failureReason).toBe('ERROR');
    expect(serialized).not.toContain('private@example.test');
    expect(serialized).not.toContain('secret prompt');
    expect(serialized).not.toContain('Private traveler details');
  });
});

describe('ResearchService', () => {
  it('returns a dashboard summary with distributions and sanitized error codes', async () => {
    const prisma = createPrismaMock();
    prisma.aiExperimentRun.aggregate.mockResolvedValue({
      _count: { _all: 7 },
      _sum: { inputTokens: 100, outputTokens: 50, estimatedCost: '1.25000000' },
      _avg: { latencyMs: 125.5 },
    });
    prisma.aiExperimentRun.groupBy.mockImplementation(
      async ({ by }: { by: string[] }) => {
        if (by[0] === 'experimentMode') {
          return [{ experimentMode: 'E', _count: { _all: 5 } }, { experimentMode: 'B', _count: { _all: 2 } }];
        }
        if (by[0] === 'requestType') {
          return [{ requestType: 'ITINERARY', _count: { _all: 7 } }];
        }
        if (by[0] === 'model') {
          return [{ model: 'research-model', _count: { _all: 7 } }];
        }
        return [{ provider: 'local', _count: { _all: 7 } }];
      },
    );
    prisma.aiExperimentRun.count.mockResolvedValue(2);
    prisma.aiEvaluationResult.count.mockResolvedValue(3);
    prisma.assessmentAttempt.count.mockResolvedValue(4);
    prisma.aiExperimentRun.findMany.mockResolvedValue([
      {
        validatorResult: {
          valid: false,
          violations: [{ code: 'DAILY_TIME_EXCEEDED' }],
        },
        failureReason: null,
      },
      {
        validatorResult: null,
        failureReason: 'raw provider message with private details',
      },
    ]);
    const service = new ResearchService(
      prisma as never,
      new ConfigService(),
    );

    const summary = await service.summary();

    expect(summary).toMatchObject({
      totalAiRequests: 7,
      totalInputTokens: 100,
      totalOutputTokens: 50,
      estimatedAiCost: 1.25,
      averageLatencyMs: 125.5,
      routeValidationFailures: 2,
      guideAssessmentCount: 4,
      humanEvaluationCount: 3,
    });
    expect(summary.experimentModeDistribution).toEqual([
      { value: 'E', count: 5 },
      { value: 'B', count: 2 },
    ]);
    expect(summary.commonValidationErrors).toEqual([
      { code: 'DAILY_TIME_EXCEEDED', count: 1 },
      { code: 'UNSTRUCTURED_FAILURE_REDACTED', count: 1 },
    ]);
    expect(JSON.stringify(summary)).not.toContain('private details');
  });

  it('exports only the fixed whitelist with pseudonymous IDs and no notes or tool payloads', async () => {
    const prisma = createPrismaMock();
    prisma.aiExperimentRun.findMany.mockResolvedValue([
      {
        id: 'raw-run-id',
        userId: 'raw-user-id',
        conversationId: 'raw-conversation-id',
        routeId: 'raw-route-id',
        experimentMode: 'E',
        requestType: 'GUIDE_MATCHING',
        provider: 'local',
        model: '=FORMULA(1,2)',
        promptVersion: 'prompt-v1',
        routeFamily: 'GOBI',
        inputTokens: 44,
        outputTokens: 22,
        latencyMs: 99,
        estimatedCost: '0.01250000',
        toolCalls: [
          { name: 'searchGuides', args: { email: 'private@example.test' } },
          { name: 'matchGuides', result: { certificateReference: 'secret-ref' } },
        ],
        validatorResult: {
          valid: false,
          violations: [
            {
              code: 'FIRST_AID_REQUIREMENT_NOT_MET',
              message: 'private safety details',
            },
          ],
        },
        finalValidity: false,
        failureReason: 'raw provider failure containing private text',
        metadata: { email: 'private@example.test', prompt: 'private prompt' },
        createdAt: new Date('2026-08-15T10:00:00.000Z'),
        evaluationResults: [
          {
            id: 'raw-evaluation-id',
            reviewerId: 'raw-reviewer-id',
            evaluatorType: 'HUMAN',
            blindEvaluation: true,
            factualAccuracy: '0.90',
            hallucinationDetected: false,
            poiValidity: '1.00',
            spatialFeasibility: '0.80',
            temporalFeasibility: '0.70',
            budgetCompliance: '1.00',
            seasonCompliance: '1.00',
            safetyViolation: true,
            personalizationScore: '0.75',
            aiScore: '80.00',
            humanScore: '76.00',
            aiPass: true,
            humanPass: true,
            aiCefr: 'B2',
            humanCefr: 'B1',
            safetyFalseNegative: false,
            safetyFalsePositive: false,
            notes: 'private reviewer notes',
          },
        ],
      },
    ]);
    const service = new ResearchService(
      prisma as never,
      new ConfigService({
        RESEARCH_EXPORT_ENABLED: true,
        RESEARCH_EXPORT_SALT: 'private-test-salt-value',
      }),
    );

    const jsonExport = await service.exportData('json');
    const parsed = JSON.parse(jsonExport.body) as {
      data: Array<Record<string, unknown>>;
    };
    const serialized = JSON.stringify(parsed);
    expect(jsonExport.rowCount).toBe(1);
    expect(parsed.data[0].run_id).toMatch(/^p_[a-f0-9]{24}$/);
    expect(parsed.data[0].user_id).toMatch(/^p_[a-f0-9]{24}$/);
    expect(parsed.data[0].tool_calls).toBe('["searchGuides","matchGuides"]');
    expect(parsed.data[0].validation_codes).toBe('["FIRST_AID_REQUIREMENT_NOT_MET"]');
    expect(parsed.data[0]).not.toHaveProperty('notes');
    expect(parsed.data[0]).not.toHaveProperty('metadata');
    for (const privateValue of [
      'raw-run-id',
      'raw-user-id',
      'raw-conversation-id',
      'raw-reviewer-id',
      'private@example.test',
      'secret-ref',
      'private safety details',
      'private reviewer notes',
      'private prompt',
    ]) {
      expect(serialized).not.toContain(privateValue);
    }

    const csvExport = await service.exportData('csv');
    expect(csvExport.body).toContain("'=FORMULA(1,2)");
    expect(csvExport.body).not.toContain('private@example.test');
    expect(csvExport.body).not.toContain('raw-user-id');
  });

  it('stores an ADMIN review as a human evaluation tied to the authenticated reviewer', async () => {
    const prisma = createPrismaMock();
    prisma.aiExperimentRun.findUnique.mockResolvedValue({
      id: 'run-id',
      evaluationResults: [{ aiScore: 78, aiPass: true, aiCefr: null, safetyViolation: false }],
    });
    prisma.aiEvaluationResult.upsert.mockResolvedValue({ id: 'evaluation-id' });
    const service = new ResearchService(prisma as never, new ConfigService());

    await service.addEvaluation('reviewer-id', 'run-id', {
      humanScore: 82,
      humanPass: true,
      safetyViolation: true,
      notes: '  reviewed independently  ',
    });

    expect(prisma.aiEvaluationResult.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          experimentRunId: 'run-id',
          reviewerId: 'reviewer-id',
          evaluatorType: EvaluatorType.HUMAN,
          blindEvaluation: true,
          aiScore: 78,
          humanScore: 82,
          safetyFalseNegative: true,
          notes: 'reviewed independently',
        }),
      }),
    );
  });
});
