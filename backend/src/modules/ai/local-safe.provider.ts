import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AiProvider } from './ai-provider.interface.js';
import { AiGenerateOptions, AiRequestType, AiStructuredOptions, AiStructuredResult, AiTextResult, GuideResponseEvaluation } from './ai.types.js';

@Injectable()
export class LocalSafeAiProvider implements AiProvider {
  async generateText(options: AiGenerateOptions): Promise<AiTextResult> {
    return {
      text: 'Verified information is unavailable. Configure an AI provider or use the deterministic tourism tools.',
      usage: { model: 'local-safe-fallback', inputTokens: this.estimate(options.prompt), outputTokens: 14, estimatedCostUsd: 0 },
    };
  }

  async generateStructuredOutput<T>(_options: AiStructuredOptions): Promise<AiStructuredResult<T>> {
    throw new ServiceUnavailableException('Structured AI generation is unavailable until an AI provider is configured');
  }

  async generateEmbedding(input: string): Promise<number[]> {
    const dimensions = 64;
    const vector = Array.from({ length: dimensions }, () => 0);
    for (const token of input.toLocaleLowerCase().split(/\s+/).filter(Boolean)) {
      let hash = 2166136261;
      for (const char of token) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
      vector[Math.abs(hash) % dimensions] += 1;
    }
    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
    return vector.map((value) => value / norm);
  }

  async classifyRequest(input: string): Promise<AiRequestType> {
    const value = input.toLocaleLowerCase();
    if (/safety|danger|first.?aid|аюул|осол|анхны тусламж/.test(value)) return 'SAFETY_INFORMATION';
    if (/match.*guide|guide.*match|хөтөч.*таар|тохирох.*хөтөч/.test(value)) return 'GUIDE_MATCHING';
    if (/guide|хөтөч/.test(value)) return 'GUIDE_SEARCH';
    if (/compare|харьцуул/.test(value)) return 'TOUR_COMPARISON';
    if (/translate|орчуул/.test(value)) return 'TRANSLATION';
    if (/book|захиал/.test(value)) return 'BOOKING_HELP';
    if (/route|маршрут/.test(value)) return 'ROUTE_PLANNING';
    if (/itinerary|trip|day|аялал|өдөр/.test(value)) return 'ITINERARY';
    return 'GENERAL_TRAVEL';
  }

  async evaluateGuideResponse(_input: string, _rubric: Record<string, unknown>): Promise<GuideResponseEvaluation> {
    throw new ServiceUnavailableException('AI guide evaluation is unavailable until an AI provider is configured');
  }

  private estimate(input: string) { return Math.max(1, Math.ceil(input.length / 4)); }
}
