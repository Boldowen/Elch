import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type { AiUsage } from '../ai.types.js';
import type { ModelRef } from '../model-router.service.js';
import { ToolRegistryService } from '../tools/tool-registry.service.js';
import type { AiToolContext } from '../tools/tool.types.js';
import { ClaudeMessagesService } from './claude-messages.service.js';

export interface ClaudeRuntimeInput {
  model: ModelRef;
  /** Byte-stable instructions; cached together with the tool definitions. */
  stableSystem: string;
  /** Per-request verified context; placed after the cache breakpoint. */
  volatileSystem: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  useTools: boolean;
  maxToolRounds: number;
  context: AiToolContext;
  onDelta?: (delta: string) => void | Promise<void>;
  abortSignal?: AbortSignal;
}

export interface ClaudeRuntimeResult {
  text: string;
  usage: AiUsage;
  finishReason: string;
  toolRounds: number;
  toolTrace: Array<{ name: string; status: 'SUCCEEDED' | 'FAILED'; latencyMs: number }>;
}

const MAX_TOOL_RESULT_CHARS = 24_000;

@Injectable()
export class ClaudeAssistantRuntime {
  constructor(
    private readonly config: ConfigService,
    private readonly claude: ClaudeMessagesService,
    private readonly tools: ToolRegistryService,
  ) {}

  isAvailable() {
    return this.claude.isAvailable();
  }

  /**
   * Manual streaming tool loop. The last permitted round runs with
   * `tool_choice: none` so the model always ends with a text answer instead of
   * an unanswered tool call.
   */
  async run(input: ClaudeRuntimeInput): Promise<ClaudeRuntimeResult> {
    try {
      return await this.loop(input);
    } catch (error) {
      throw this.claude.toHttpError(error);
    }
  }

  private async loop(input: ClaudeRuntimeInput): Promise<ClaudeRuntimeResult> {
    const tools = input.useTools ? this.tools.anthropicTools() : undefined;
    const messages: Anthropic.Beta.BetaMessageParam[] = this.firstUserOnward(input.messages)
      .map((message) => ({ role: message.role, content: message.content }));
    const system: Anthropic.Beta.BetaTextBlockParam[] = [
      { type: 'text', text: input.stableSystem, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: input.volatileSystem },
    ];
    const signal = this.signal(input.abortSignal);
    const trace: ClaudeRuntimeResult['toolTrace'] = [];
    let usage: AiUsage | null = null;
    let text = '';

    for (let round = 0; ; round += 1) {
      const lastRound = !tools || round >= input.maxToolRounds;
      const message = await this.sendRound({
        ...this.claude.baseParams(input.model.model),
        // Auto-caches the growing conversation so later tool rounds reuse it.
        cache_control: { type: 'ephemeral' },
        system,
        messages,
        ...(tools ? { tools, tool_choice: lastRound ? { type: 'none' as const } : { type: 'auto' as const } } : {}),
      }, input.onDelta, signal);
      usage = this.claude.accumulate(usage, message, input.model.ref);
      text += this.claude.text(message);

      if (message.stop_reason === 'refusal') {
        return { text: '', usage, finishReason: 'refusal', toolRounds: round, toolTrace: trace };
      }
      const toolUses = message.content.filter(
        (block): block is Anthropic.Beta.BetaToolUseBlock => block.type === 'tool_use',
      );
      if (message.stop_reason !== 'tool_use' || !toolUses.length || lastRound) {
        return { text, usage, finishReason: message.stop_reason ?? 'unknown', toolRounds: round, toolTrace: trace };
      }
      // Thinking and tool_use blocks must be replayed unchanged.
      messages.push({ role: 'assistant', content: message.content });
      const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
      for (const call of toolUses) results.push(await this.runTool(call, input.context, trace));
      messages.push({ role: 'user', content: results });
      text = '';
    }
  }

  /**
   * With eager input streaming the SDK rejects when a streamed tool input is
   * not parseable JSON; only that case is re-issued (API errors propagate).
   */
  private async sendRound(
    params: Parameters<ClaudeMessagesService['send']>[0],
    onText: ClaudeRuntimeInput['onDelta'],
    signal: AbortSignal,
  ) {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await this.claude.send(params, { onText, signal });
      } catch (error) {
        if (error instanceof Anthropic.APIError || signal.aborted || attempt >= 2) throw error;
      }
    }
  }

  private async runTool(
    call: Anthropic.Beta.BetaToolUseBlock,
    context: AiToolContext,
    trace: ClaudeRuntimeResult['toolTrace'],
  ): Promise<Anthropic.Beta.BetaToolResultBlockParam> {
    const startedAt = Date.now();
    const timeoutMs = this.config.get<number>('AI_TOOL_TIMEOUT_MS', 10_000);
    let timer: NodeJS.Timeout | undefined;
    try {
      const result = await Promise.race([
        this.tools.executeModelToolCall(call.name, call.input, context),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('Tool execution timed out')), timeoutMs);
        }),
      ]);
      trace.push({ name: call.name, status: 'SUCCEEDED', latencyMs: Date.now() - startedAt });
      return { type: 'tool_result', tool_use_id: call.id, content: this.serialize(result) };
    } catch (error) {
      trace.push({ name: call.name, status: 'FAILED', latencyMs: Date.now() - startedAt });
      const message = error instanceof Error ? error.message.slice(0, 300) : 'Tool execution failed';
      return {
        type: 'tool_result',
        tool_use_id: call.id,
        is_error: true,
        content: JSON.stringify({ error: message, meaning: 'unknown/unavailable - not safe, open, permitted or available' }),
      };
    } finally {
      clearTimeout(timer);
    }
  }

  private serialize(result: unknown) {
    const json = JSON.stringify(result);
    return json.length <= MAX_TOOL_RESULT_CHARS
      ? json
      : JSON.stringify({ truncated: true, partial: json.slice(0, MAX_TOOL_RESULT_CHARS) });
  }

  /** The Messages API requires the first message to be from the user. */
  private firstUserOnward(messages: ClaudeRuntimeInput['messages']) {
    const first = messages.findIndex((message) => message.role === 'user');
    return first < 0 ? [] : messages.slice(first);
  }

  private signal(external?: AbortSignal) {
    const timeout = AbortSignal.timeout(this.config.get<number>('ANTHROPIC_TIMEOUT_MS', 120_000));
    return external ? AbortSignal.any([external, timeout]) : timeout;
  }
}
