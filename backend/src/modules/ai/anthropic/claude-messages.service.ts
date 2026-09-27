import {
  BadGatewayException,
  GatewayTimeoutException,
  Inject,
  Injectable,
  Logger,
  Optional,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type { AiUsage } from '../ai.types.js';

export const ANTHROPIC_CLIENT = Symbol('ANTHROPIC_CLIENT');

/** The slice of the SDK client the application uses; tests inject a fake. */
export type AnthropicClient = Pick<Anthropic, 'beta'>;

export type ClaudeStreamParams = Anthropic.Beta.Messages.MessageCreateParamsNonStreaming;
export type ClaudeEffort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

/** USD per million tokens (Claude API first-party rates, 2026-06). */
const PRICES: Record<string, { input: number; output: number }> = {
  'claude-fable-5-1': { input: 10, output: 50 },
  'claude-fable-5': { input: 10, output: 50 },
  'claude-opus-5-5': { input: 4, output: 20 },
  'claude-opus-5': { input: 5, output: 25 },
  'claude-opus-4-8': { input: 5, output: 25 },
  'claude-sonnet-5': { input: 2, output: 10 },
  'claude-sonnet-4-6': { input: 3, output: 15 },
  'claude-haiku-4-5': { input: 1, output: 5 },
};

/** Models that accept the server-side `fallbacks: "default"` refusal routing. */
const SERVER_FALLBACK_MODELS = new Set(['claude-opus-5', 'claude-fable-5', 'claude-fable-5-1']);
const SERVER_FALLBACK_BETA = 'server-side-fallback-2026-07-01';

/** Status, error type, API message and request id of an Anthropic API error (for logs/diagnostics). */
export function describeAnthropicError(error: unknown) {
  if (!(error instanceof Anthropic.APIError)) return null;
  const body = error.error as { error?: { type?: string; message?: string } } | undefined;
  return {
    status: error.status ?? null,
    type: body?.error?.type ?? null,
    message: (body?.error?.message ?? error.message).slice(0, 500),
    requestId: error.requestID ?? null,
  };
}

export function createAnthropicClient(config: ConfigService): AnthropicClient | null {
  const apiKey = config.get<string>('ANTHROPIC_API_KEY', '').trim();
  if (!apiKey) return null;
  return new Anthropic({
    apiKey,
    timeout: config.get<number>('ANTHROPIC_TIMEOUT_MS', 120_000),
    maxRetries: config.get<number>('AI_RETRY_ATTEMPTS', 1),
  });
}

@Injectable()
export class ClaudeMessagesService {
  private readonly logger = new Logger(ClaudeMessagesService.name);

  constructor(
    private readonly config: ConfigService,
    @Optional() @Inject(ANTHROPIC_CLIENT) private readonly anthropic?: AnthropicClient | null,
  ) {}

  isAvailable() {
    return Boolean(this.anthropic);
  }

  /**
   * Shared request settings: adaptive thinking, optional effort, and the
   * server-side refusal fallback on models that support it.
   */
  baseParams(model: string, overrides: { effort?: ClaudeEffort; maxTokens?: number } = {}) {
    const effort = overrides.effort ?? this.configuredEffort();
    const fallback = this.config.get<boolean>('ANTHROPIC_REFUSAL_FALLBACK', true) && SERVER_FALLBACK_MODELS.has(model);
    return {
      model,
      max_tokens: overrides.maxTokens ?? this.config.get<number>('ANTHROPIC_MAX_TOKENS', 16_000),
      thinking: { type: 'adaptive' as const },
      ...(effort ? { output_config: { effort } } : {}),
      ...(fallback ? { betas: [SERVER_FALLBACK_BETA], fallbacks: 'default' as const } : {}),
    };
  }

  /**
   * Streams one request (avoids HTTP timeouts with thinking enabled), forwards
   * text deltas, and resolves with the complete message.
   */
  async send(
    params: ClaudeStreamParams,
    options: { onText?: (delta: string) => void | Promise<void>; signal?: AbortSignal } = {},
  ): Promise<Anthropic.Beta.BetaMessage> {
    const stream = this.client().beta.messages.stream(params, { signal: options.signal });
    for await (const event of stream) {
      if (options.onText && event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        await options.onText(event.delta.text);
      }
    }
    return stream.finalMessage();
  }

  text(message: Anthropic.Beta.BetaMessage) {
    return message.content
      .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');
  }

  /** Adds this message's usage to `total` (tool loops call it once per round). */
  accumulate(total: AiUsage | null, message: Anthropic.Beta.BetaMessage, ref: string): AiUsage {
    const input = message.usage.input_tokens ?? 0;
    const cacheRead = message.usage.cache_read_input_tokens ?? 0;
    const cacheWrite = message.usage.cache_creation_input_tokens ?? 0;
    const output = message.usage.output_tokens ?? 0;
    const price = PRICES[message.model] ?? PRICES[ref.replace(/^anthropic:/, '')];
    const inputRate = price?.input ?? this.config.get<number>('AI_INPUT_COST_PER_MILLION', 0);
    const outputRate = price?.output ?? this.config.get<number>('AI_OUTPUT_COST_PER_MILLION', 0);
    const cost = (input * inputRate + cacheWrite * inputRate * 1.25 + cacheRead * inputRate * 0.1 + output * outputRate) / 1_000_000;
    return {
      model: ref,
      inputTokens: (total?.inputTokens ?? 0) + input + cacheRead + cacheWrite,
      outputTokens: (total?.outputTokens ?? 0) + output,
      cacheReadInputTokens: (total?.cacheReadInputTokens ?? 0) + cacheRead,
      cacheCreationInputTokens: (total?.cacheCreationInputTokens ?? 0) + cacheWrite,
      estimatedCostUsd: Number(((total?.estimatedCostUsd ?? 0) + cost).toFixed(8)),
    };
  }

  /** Converts SDK errors to the same HTTP exceptions the other providers raise. */
  toHttpError(error: unknown): Error {
    if (error instanceof ServiceUnavailableException || error instanceof BadGatewayException || error instanceof GatewayTimeoutException) {
      return error;
    }
    const cause = { cause: error };
    if (error instanceof Anthropic.APIConnectionTimeoutError) return new GatewayTimeoutException('AI provider request timed out', cause);
    if (error instanceof Anthropic.APIUserAbortError) return new GatewayTimeoutException('AI provider request was aborted', cause);
    if (error instanceof Anthropic.APIError) {
      // The API's own explanation goes to the server log (and `cause`), never to the HTTP client.
      this.logger.warn(JSON.stringify({ event: 'anthropic_api_error', ...describeAnthropicError(error) }));
    }
    if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
      return new ServiceUnavailableException('Anthropic credentials are invalid or not permitted', cause);
    }
    if (error instanceof Anthropic.RateLimitError) return new ServiceUnavailableException('AI provider rate limit reached', cause);
    if (error instanceof Anthropic.APIError) return new BadGatewayException(`AI provider failed with status ${error.status ?? 'unknown'}`, cause);
    const name = (error as { name?: string } | undefined)?.name;
    if (name === 'AbortError' || name === 'TimeoutError') return new GatewayTimeoutException('AI provider request timed out');
    return new BadGatewayException('AI provider request failed', cause);
  }

  private client(): AnthropicClient {
    if (!this.anthropic) throw new ServiceUnavailableException('ANTHROPIC_API_KEY is not configured');
    return this.anthropic;
  }

  private configuredEffort(): ClaudeEffort | undefined {
    const value = this.config.get<string>('ANTHROPIC_EFFORT', '');
    return value === 'low' || value === 'medium' || value === 'high' || value === 'xhigh' || value === 'max' ? value : undefined;
  }
}
