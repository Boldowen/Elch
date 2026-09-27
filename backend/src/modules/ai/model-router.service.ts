import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AiRequestType } from './ai.types.js';

/**
 * `anthropic` - Claude through the official Anthropic SDK.
 * `openai`    - OpenAI Responses API.
 * `compat`    - any OpenAI-compatible chat endpoint (vLLM/Ollama serving the
 *               fine-tuned open-weight model on Kaggle, a rented GPU or the
 *               project's own server - only AI_COMPAT_BASE_URL changes).
 */
export type ModelProvider = 'anthropic' | 'openai' | 'compat' | 'local';

export interface ModelRef {
  provider: ModelProvider;
  model: string;
  /** Canonical `provider:model` string recorded in experiment logs. */
  ref: string;
}

export type ModelRole = 'default' | 'advanced' | 'safety';

const PREFIXED = /^(anthropic|openai|compat):(.+)$/;

@Injectable()
export class ModelRouterService {
  constructor(private readonly config: ConfigService) {}

  /**
   * Model values may be `provider:model` (e.g. `anthropic:claude-opus-5`,
   * `compat:elch-qwen-lora`). A bare model name keeps the legacy meaning and
   * uses AI_PROVIDER.
   */
  parse(value: string): ModelRef {
    const trimmed = value.trim();
    const match = PREFIXED.exec(trimmed);
    if (match) {
      const provider = match[1] as ModelProvider;
      return { provider, model: match[2], ref: `${provider}:${match[2]}` };
    }
    const configured = this.config.get<string>('AI_PROVIDER', 'local');
    const provider: ModelProvider = configured === 'anthropic' || configured === 'openai' || configured === 'compat'
      ? configured
      : 'local';
    return { provider, model: trimmed, ref: `${provider}:${trimmed}` };
  }

  forRole(role: ModelRole): ModelRef {
    const configured = (key: string) => this.config.get<string>(key, '').trim();
    const value = role === 'safety'
      ? configured('AI_SAFETY_MODEL') || configured('AI_ADVANCED_MODEL')
      : configured(role === 'advanced' ? 'AI_ADVANCED_MODEL' : 'AI_DEFAULT_MODEL');
    return this.allowed(this.parse(value || this.providerDefault(role)));
  }

  /** Used when a role's model is not configured. */
  private providerDefault(role: ModelRole) {
    switch (this.config.get<string>('AI_PROVIDER', 'local')) {
      case 'anthropic': return `anthropic:${this.config.get<string>('ANTHROPIC_MODEL', '') || 'claude-opus-5'}`;
      case 'openai': return role === 'default' ? 'openai:gpt-5-mini' : 'openai:gpt-5.6';
      default: return '';
    }
  }

  /** Experiment modes C-E use the domain (advanced) model; safety intents always use the safety model. */
  forRequest(intent: AiRequestType, useDomainModel: boolean): ModelRef {
    if (intent === 'SAFETY_INFORMATION') return this.forRole('safety');
    return this.forRole(useDomainModel ? 'advanced' : 'default');
  }

  isConfigured(ref: ModelRef): boolean {
    if (!ref.model) return false;
    switch (ref.provider) {
      case 'anthropic': return this.config.get<string>('ANTHROPIC_API_KEY', '').trim().length > 0;
      case 'openai': return this.config.get<string>('OPENAI_API_KEY', '').trim().length > 0;
      case 'compat': return this.config.get<string>('AI_COMPAT_BASE_URL', '').trim().length > 0;
      case 'local': return false;
    }
  }

  private allowed(ref: ModelRef): ModelRef {
    const allowList = this.config.get<string>('AI_ALLOWED_MODELS', '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => this.parse(value));
    if (!allowList.length || allowList.some((candidate) => candidate.ref === ref.ref)) return ref;
    return allowList[0];
  }
}
