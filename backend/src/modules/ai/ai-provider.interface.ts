import {
  AiGenerateOptions,
  AiRequestType,
  AiStructuredOptions,
  AiStructuredResult,
  AiTextResult,
  GuideResponseEvaluation,
} from './ai.types.js';

export const AI_PROVIDER = Symbol('AI_PROVIDER');

export interface AiProvider {
  generateText(options: AiGenerateOptions): Promise<AiTextResult>;
  generateStructuredOutput<T>(options: AiStructuredOptions): Promise<AiStructuredResult<T>>;
  generateEmbedding(input: string): Promise<number[]>;
  classifyRequest(input: string): Promise<AiRequestType>;
  evaluateGuideResponse(input: string, rubric: Record<string, unknown>): Promise<GuideResponseEvaluation>;
}
