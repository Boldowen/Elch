export type AiExperimentMode = 'A' | 'B' | 'C' | 'D' | 'E';

export type AiRequestType =
  | 'GENERAL_TRAVEL'
  | 'DESTINATION_QA'
  | 'ITINERARY'
  | 'ROUTE_PLANNING'
  | 'GUIDE_SEARCH'
  | 'GUIDE_MATCHING'
  | 'TOUR_SEARCH'
  | 'TOUR_COMPARISON'
  | 'TRANSLATION'
  | 'SAFETY_INFORMATION'
  | 'BOOKING_HELP'
  | 'OTHER';

export interface AiUsage {
  model: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
}

export interface AiTextResult {
  text: string;
  usage: AiUsage;
}

export interface AiStructuredResult<T> {
  data: T;
  usage: AiUsage;
}

export interface AiGenerateOptions {
  system: string;
  prompt: string;
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
}

export interface AiStructuredOptions extends AiGenerateOptions {
  schemaName: string;
  jsonSchema: Record<string, unknown>;
}

export interface GuideResponseEvaluation {
  scores: Record<string, number>;
  confidence: number;
  unsafeActions: string[];
  feedback: string;
}

export interface ExperimentFeatures {
  useDomainModel: boolean;
  useRag: boolean;
  useRouteGraph: boolean;
  useTools: boolean;
  useValidator: boolean;
}
