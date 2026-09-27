import { jest } from '@jest/globals';
import { ConfigService } from '@nestjs/config';
import type Anthropic from '@anthropic-ai/sdk';
import { ClaudeAssistantRuntime } from '../src/modules/ai/anthropic/claude-assistant.runtime.js';
import { ClaudeMessagesService } from '../src/modules/ai/anthropic/claude-messages.service.js';
import { AnthropicAiProvider, toClaudeOutputSchema } from '../src/modules/ai/anthropic/anthropic.provider.js';
import { EmbeddingService } from '../src/modules/ai/embedding.service.js';
import { ModelRouterService } from '../src/modules/ai/model-router.service.js';
import { ToolRegistryService } from '../src/modules/ai/tools/tool-registry.service.js';
import { RoutePlanningService } from '../src/modules/route-planning/route-planning.service.js';

type StreamParams = Record<string, unknown> & { messages: Anthropic.Beta.BetaMessageParam[] };

function message(overrides: Partial<Anthropic.Beta.BetaMessage>): Anthropic.Beta.BetaMessage {
  return {
    id: 'msg_test',
    type: 'message',
    role: 'assistant',
    model: 'claude-opus-5',
    content: [],
    stop_reason: 'end_turn',
    stop_sequence: null,
    usage: { input_tokens: 100, output_tokens: 20, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
    ...overrides,
  } as Anthropic.Beta.BetaMessage;
}

/** A fake SDK client that replays scripted messages and records each request. */
function fakeClient(script: Anthropic.Beta.BetaMessage[]) {
  const requests: StreamParams[] = [];
  const stream = jest.fn((params: StreamParams) => {
    requests.push(structuredClone(params));
    const next = script.shift();
    if (!next) throw new Error('unexpected extra request');
    const events = next.content
      .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === 'text')
      .map((block) => ({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: block.text } }));
    return {
      async *[Symbol.asyncIterator]() { yield* events; },
      finalMessage: async () => next,
    };
  });
  return { client: { beta: { messages: { stream } } } as never, requests, stream };
}

function config(values: Record<string, unknown> = {}) {
  return new ConfigService({
    AI_PROVIDER: 'anthropic',
    ANTHROPIC_API_KEY: 'test-key',
    AI_DEFAULT_MODEL: 'anthropic:claude-opus-5',
    AI_ADVANCED_MODEL: 'anthropic:claude-opus-5',
    ...values,
  });
}

describe('model router', () => {
  it('parses provider-prefixed and legacy bare model references', () => {
    const router = new ModelRouterService(config({ AI_PROVIDER: 'openai' }));
    expect(router.parse('anthropic:claude-opus-5')).toEqual({ provider: 'anthropic', model: 'claude-opus-5', ref: 'anthropic:claude-opus-5' });
    expect(router.parse('compat:elch-qwen-lora')).toMatchObject({ provider: 'compat', model: 'elch-qwen-lora' });
    expect(router.parse('gpt-5-mini')).toMatchObject({ provider: 'openai', model: 'gpt-5-mini' });
  });

  it('routes experiment arms and safety intents to their configured models', () => {
    const router = new ModelRouterService(config({
      AI_DEFAULT_MODEL: 'compat:qwen-base',
      AI_ADVANCED_MODEL: 'compat:qwen-lora',
      AI_SAFETY_MODEL: 'anthropic:claude-opus-5',
      AI_COMPAT_BASE_URL: 'https://gpu.example.com/v1',
    }));
    expect(router.forRequest('ITINERARY', false).ref).toBe('compat:qwen-base');
    expect(router.forRequest('ITINERARY', true).ref).toBe('compat:qwen-lora');
    expect(router.forRequest('SAFETY_INFORMATION', false).ref).toBe('anthropic:claude-opus-5');
    expect(router.isConfigured(router.forRole('default'))).toBe(true);
  });

  it('falls back to the first allow-listed model and reports missing credentials', () => {
    const router = new ModelRouterService(config({
      AI_DEFAULT_MODEL: 'anthropic:claude-unlisted',
      AI_ALLOWED_MODELS: 'anthropic:claude-opus-5,compat:qwen-lora',
      ANTHROPIC_API_KEY: '',
    }));
    const ref = router.forRole('default');
    expect(ref.ref).toBe('anthropic:claude-opus-5');
    expect(router.isConfigured(ref)).toBe(false);
  });
});

describe('Claude tool definitions', () => {
  const registry = new ToolRegistryService({} as never, new RoutePlanningService(), {} as never);

  it('derives a stable, sorted JSON-schema tool list from the Zod allow-list', () => {
    const tools = registry.anthropicTools();
    const names = tools.map((tool) => tool.name);
    expect(names).toHaveLength(18);
    expect(names).toEqual([...names].sort((left, right) => left.localeCompare(right)));
    for (const tool of tools) {
      expect(tool.input_schema.type).toBe('object');
      expect(tool.input_schema).not.toHaveProperty('$schema');
      expect(tool.eager_input_streaming).toBe(true);
    }
    expect(JSON.stringify(registry.anthropicTools())).toBe(JSON.stringify(tools));
  });

  it('validates model-supplied input before executing a tool', async () => {
    await expect(registry.executeModelToolCall('searchRoutes', { query: 'Gobi', limit: 999 }, { userId: 'u', roles: [] }))
      .rejects.toMatchObject({ status: 400 });
    await expect(registry.executeModelToolCall('dropTables', {}, { userId: 'u', roles: [] }))
      .rejects.toMatchObject({ status: 400 });
    const result = await registry.executeModelToolCall('searchRoutes', { query: 'Gobi', limit: null }, { userId: 'u', roles: [] });
    expect(result.data).toEqual([expect.objectContaining({ id: 'gobi' })]);
  });
});

describe('Claude assistant runtime', () => {
  const registry = new ToolRegistryService({} as never, new RoutePlanningService(), {} as never);
  const baseInput = {
    model: { provider: 'anthropic' as const, model: 'claude-opus-5', ref: 'anthropic:claude-opus-5' },
    stableSystem: 'Stable tourism instructions.',
    volatileSystem: 'Verified context: {"route":"gobi"}',
    messages: [
      { role: 'assistant' as const, content: 'orphaned greeting' },
      { role: 'user' as const, content: 'Plan a Gobi trip' },
    ],
    context: { userId: 'user-1', roles: ['TRAVELER'] },
  };

  it('runs a streaming tool loop, validates tool input and caches the stable prefix', async () => {
    const toolUse = { type: 'tool_use', id: 'toolu_1', name: 'searchRoutes', input: { query: 'Gobi', limit: null } };
    const { client, requests } = fakeClient([
      message({
        stop_reason: 'tool_use',
        content: [{ type: 'text', text: 'Checking routes. ' }, toolUse] as never,
        usage: { input_tokens: 50, output_tokens: 30, cache_read_input_tokens: 0, cache_creation_input_tokens: 2000 } as never,
      }),
      message({
        content: [{ type: 'text', text: 'The Gobi route takes 6-9 days.' }] as never,
        usage: { input_tokens: 80, output_tokens: 40, cache_read_input_tokens: 2000, cache_creation_input_tokens: 0 } as never,
      }),
    ]);
    const runtime = new ClaudeAssistantRuntime(config(), new ClaudeMessagesService(config(), client), registry);
    const deltas: string[] = [];

    const result = await runtime.run({ ...baseInput, useTools: true, maxToolRounds: 2, onDelta: (delta) => { deltas.push(delta); } });

    expect(result.text).toBe('The Gobi route takes 6-9 days.');
    expect(result.toolRounds).toBe(1);
    expect(result.toolTrace).toEqual([expect.objectContaining({ name: 'searchRoutes', status: 'SUCCEEDED' })]);
    expect(deltas.join('')).toBe('Checking routes. The Gobi route takes 6-9 days.');
    expect(result.usage).toMatchObject({ model: 'anthropic:claude-opus-5', cacheReadInputTokens: 2000, cacheCreationInputTokens: 2000, outputTokens: 70 });
    expect(result.usage.estimatedCostUsd).toBeGreaterThan(0);

    const [first, second] = requests;
    expect(first.system).toEqual([
      { type: 'text', text: 'Stable tourism instructions.', cache_control: { type: 'ephemeral' } },
      { type: 'text', text: 'Verified context: {"route":"gobi"}' },
    ]);
    expect(first.messages).toEqual([{ role: 'user', content: 'Plan a Gobi trip' }]);
    expect(first).toMatchObject({ thinking: { type: 'adaptive' }, tool_choice: { type: 'auto' }, cache_control: { type: 'ephemeral' } });
    expect(first).toMatchObject({ betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' });
    expect(second.messages[1]).toEqual({ role: 'assistant', content: [{ type: 'text', text: 'Checking routes. ' }, toolUse] });
    const toolResult = (second.messages[2].content as Anthropic.Beta.BetaToolResultBlockParam[])[0];
    expect(toolResult).toMatchObject({ type: 'tool_result', tool_use_id: 'toolu_1' });
    expect(toolResult.is_error).toBeUndefined();
    expect(String(toolResult.content)).toContain('gobi');
    expect(second.tools).toEqual(first.tools);
  });

  it('forces a text answer on the last permitted round and reports invalid tool input as an error result', async () => {
    const { client, requests } = fakeClient([
      message({
        stop_reason: 'tool_use',
        content: [{ type: 'tool_use', id: 'toolu_bad', name: 'searchRoutes', input: { limit: 'many' } }] as never,
      }),
      message({ content: [{ type: 'text', text: 'Route data is unavailable right now.' }] as never }),
    ]);
    const runtime = new ClaudeAssistantRuntime(config(), new ClaudeMessagesService(config(), client), registry);

    const result = await runtime.run({ ...baseInput, useTools: true, maxToolRounds: 1 });

    expect(requests[0].tool_choice).toEqual({ type: 'auto' });
    expect(requests[1].tool_choice).toEqual({ type: 'none' });
    expect(result.toolTrace).toEqual([expect.objectContaining({ name: 'searchRoutes', status: 'FAILED' })]);
    const errorResult = (requests[1].messages.at(-1)!.content as Anthropic.Beta.BetaToolResultBlockParam[])[0];
    expect(errorResult.is_error).toBe(true);
    expect(result.text).toBe('Route data is unavailable right now.');
  });

  it('returns no text on refusal and omits tools and fallbacks when not applicable', async () => {
    const { client, requests } = fakeClient([
      message({ model: 'claude-sonnet-5', stop_reason: 'refusal', content: [] }),
    ]);
    const runtime = new ClaudeAssistantRuntime(config(), new ClaudeMessagesService(config(), client), registry);

    const result = await runtime.run({
      ...baseInput,
      model: { provider: 'anthropic', model: 'claude-sonnet-5', ref: 'anthropic:claude-sonnet-5' },
      useTools: false,
      maxToolRounds: 0,
    });

    expect(result).toMatchObject({ text: '', finishReason: 'refusal', toolRounds: 0 });
    expect(requests[0]).not.toHaveProperty('tools');
    expect(requests[0]).not.toHaveProperty('fallbacks');
  });

  it('maps a missing client to a service-unavailable error', async () => {
    const runtime = new ClaudeAssistantRuntime(config(), new ClaudeMessagesService(config(), null), registry);
    expect(runtime.isAvailable()).toBe(false);
    await expect(runtime.run({ ...baseInput, useTools: false, maxToolRounds: 0 })).rejects.toMatchObject({ status: 503 });
  });
});

describe('Anthropic AI provider', () => {
  function provider(script: Anthropic.Beta.BetaMessage[], values: Record<string, unknown> = {}) {
    const fake = fakeClient(script);
    const cfg = config(values);
    return {
      ...fake,
      provider: new AnthropicAiProvider(cfg, new ClaudeMessagesService(cfg, fake.client), new ModelRouterService(cfg), new EmbeddingService(cfg)),
    };
  }

  it('strips JSON-schema keywords structured outputs rejects and closes every object', () => {
    expect(toClaudeOutputSchema({
      type: 'object',
      properties: { score: { type: 'number', minimum: 0, maximum: 100 }, name: { type: 'string', maxLength: 5 } },
      required: ['score'],
    })).toEqual({
      type: 'object',
      properties: { score: { type: 'number' }, name: { type: 'string' } },
      required: ['score'],
      additionalProperties: false,
    });
  });

  it('scores guide responses against explicit rubric dimensions and clamps the result', async () => {
    const { provider: claude, requests } = provider([
      message({ content: [{ type: 'text', text: JSON.stringify({
        scores: { fluency: 140, grammar: 70, vocabulary: -5, interaction: 60, clarity: 80 },
        confidence: 1.4,
        unsafeActions: [],
        feedback: 'Clear welcome.',
      }) }] as never }),
    ]);

    const evaluation = await claude.evaluateGuideResponse('[{"savedResponse":"Welcome"}]', {
      dimensions: ['fluency', 'grammar', 'vocabulary', 'interaction', 'clarity'],
    });

    expect(evaluation).toEqual({
      scores: { fluency: 100, grammar: 70, vocabulary: 0, interaction: 60, clarity: 80 },
      confidence: 1,
      unsafeActions: [],
      feedback: 'Clear welcome.',
    });
    const format = (requests[0].output_config as { format: { schema: { properties: { scores: unknown } } } }).format;
    expect(format.schema.properties.scores).toEqual({
      type: 'object',
      properties: { fluency: { type: 'number' }, grammar: { type: 'number' }, vocabulary: { type: 'number' }, interaction: { type: 'number' }, clarity: { type: 'number' } },
      required: ['fluency', 'grammar', 'vocabulary', 'interaction', 'clarity'],
      additionalProperties: false,
    });
  });

  it('classifies with low effort on the Claude model even when the experiment arm is not Claude', async () => {
    const { provider: claude, requests } = provider(
      [message({ content: [{ type: 'text', text: '{"type":"ROUTE_PLANNING"}' }] as never })],
      { AI_DEFAULT_MODEL: 'compat:qwen-base', ANTHROPIC_MODEL: 'claude-opus-5' },
    );
    await expect(claude.classifyRequest('Gobi 7 days')).resolves.toBe('ROUTE_PLANNING');
    expect(requests[0]).toMatchObject({ model: 'claude-opus-5', output_config: { effort: 'low' } });
  });

  it('turns a refusal into a bad-gateway error instead of returning empty text', async () => {
    const { provider: claude } = provider([message({ stop_reason: 'refusal', content: [] })]);
    await expect(claude.generateText({ system: 's', prompt: 'p' })).rejects.toMatchObject({ status: 502 });
  });
});

describe('embedding service', () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => { globalThis.fetch = originalFetch; });

  it('uses the local hash backend by default and records its identity', async () => {
    const embeddings = new EmbeddingService(new ConfigService({ AI_PROVIDER: 'anthropic' }));
    const vector = await embeddings.embed('Orkhon valley');
    expect(vector).toHaveLength(64);
    expect(embeddings.identity(vector.length)).toBe('local:local-safe-fnv1a:64');
  });

  it('calls an OpenAI-compatible embeddings endpoint for the compat backend', async () => {
    const fetchMock = jest.fn(async () => new Response(JSON.stringify({ data: [{ embedding: [0.1, 0.2, 0.3] }] })));
    globalThis.fetch = fetchMock as never;
    const embeddings = new EmbeddingService(new ConfigService({
      AI_EMBEDDING_PROVIDER: 'compat',
      AI_EMBEDDING_BASE_URL: 'https://gpu.example.com/v1/',
      AI_EMBEDDING_MODEL: 'multilingual-e5-large',
    }));

    await expect(embeddings.embed('Хөвсгөл нуур')).resolves.toEqual([0.1, 0.2, 0.3]);
    expect(fetchMock).toHaveBeenCalledWith('https://gpu.example.com/v1/embeddings', expect.objectContaining({ method: 'POST' }));
    expect(embeddings.identity(3)).toBe('compat:multilingual-e5-large:3');
  });
});

describe('assistant runtime routing', () => {
  const registry = new ToolRegistryService({} as never, new RoutePlanningService(), {} as never);
  const input = {
    userId: 'user-1',
    roles: ['TRAVELER'],
    mode: 'B' as const,
    features: { useDomainModel: false, useRag: true, useRouteGraph: false, useTools: false, useValidator: false },
    intent: 'DESTINATION_QA' as const,
    language: 'en' as const,
    message: 'What is Kharkhorin?',
    system: 'You are a Mongolia tourism research assistant.',
    verifiedContext: { retrievedSources: [] },
  };

  async function runtimeFor(values: Record<string, unknown>, script: Anthropic.Beta.BetaMessage[]) {
    const { AssistantRuntimeService } = await import('../src/modules/ai/assistant-runtime.service.js');
    const cfg = config(values);
    const fake = fakeClient(script);
    const claude = new ClaudeAssistantRuntime(cfg, new ClaudeMessagesService(cfg, values.ANTHROPIC_API_KEY === '' ? null : fake.client), registry);
    return { runtime: new AssistantRuntimeService(cfg, registry, new ModelRouterService(cfg), claude), ...fake };
  }

  it('dispatches anthropic model references to Claude and caches repeat answers', async () => {
    const { runtime, stream } = await runtimeFor({}, [message({ content: [{ type: 'text', text: 'Kharkhorin was the imperial capital.' }] as never })]);
    expect(runtime.isEnabled(false)).toBe(true);

    const first = await runtime.generate(input);
    const second = await runtime.generate(input);

    expect(first).toMatchObject({ provider: 'anthropic', model: 'anthropic:claude-opus-5', text: 'Kharkhorin was the imperial capital.' });
    expect(second?.cacheHit).toBe(true);
    expect(stream).toHaveBeenCalledTimes(1);
  });

  it('is disabled and returns null when the routed model has no credentials', async () => {
    const { runtime, stream } = await runtimeFor({ ANTHROPIC_API_KEY: '' }, []);
    expect(runtime.isEnabled()).toBe(false);
    await expect(runtime.generate(input)).resolves.toBeNull();
    expect(stream).not.toHaveBeenCalled();
  });
});

describe('model defaults', () => {
  it('uses the provider default when a role model is not configured', () => {
    const anthropic = new ModelRouterService(new ConfigService({ AI_PROVIDER: 'anthropic', AI_DEFAULT_MODEL: '' }));
    expect(anthropic.forRole('default').ref).toBe('anthropic:claude-opus-5');
    expect(anthropic.forRole('safety').ref).toBe('anthropic:claude-opus-5');
    const openai = new ModelRouterService(new ConfigService({ AI_PROVIDER: 'openai' }));
    expect(openai.forRole('advanced').ref).toBe('openai:gpt-5.6');
    const local = new ModelRouterService(new ConfigService({}));
    expect(local.isConfigured(local.forRole('default'))).toBe(false);
  });
});
