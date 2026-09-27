import { BadGatewayException, GatewayTimeoutException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type EmbeddingBackend = 'local' | 'openai' | 'compat';

const LOCAL_MODEL = 'local-safe-fnv1a';
const LOCAL_DIMENSIONS = 64;

/** Deterministic, dependency-free lexical hash embedding used when no embedding service is configured. */
export function localHashEmbedding(input: string): number[] {
  const vector = Array.from({ length: LOCAL_DIMENSIONS }, () => 0);
  for (const token of input.toLocaleLowerCase().split(/\s+/).filter(Boolean)) {
    let hash = 2166136261;
    for (const char of token) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    vector[Math.abs(hash) % LOCAL_DIMENSIONS] += 1;
  }
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / norm);
}

/**
 * Embeddings are configured independently of the chat model because Claude has
 * no embedding endpoint. `compat` targets any OpenAI-compatible `/embeddings`
 * server (TEI, vLLM, Ollama) so a multilingual model can run on the project's
 * own GPU host.
 */
@Injectable()
export class EmbeddingService {
  constructor(private readonly config: ConfigService) {}

  backend(): EmbeddingBackend {
    const configured = this.config.get<string>('AI_EMBEDDING_PROVIDER', 'auto');
    if (configured === 'local' || configured === 'openai' || configured === 'compat') return configured;
    return this.config.get<string>('AI_PROVIDER', 'local') === 'openai' ? 'openai' : 'local';
  }

  /** Stored beside every vector; retrieval only compares vectors with an identical identity. */
  identity(dimensions: number) {
    const backend = this.backend();
    const model = backend === 'local'
      ? LOCAL_MODEL
      : this.config.get<string>('AI_EMBEDDING_MODEL', 'text-embedding-3-small');
    return `${backend}:${model}:${dimensions}`;
  }

  async embed(input: string): Promise<number[]> {
    const backend = this.backend();
    if (backend === 'local') return localHashEmbedding(input);
    const baseUrl = backend === 'openai'
      ? 'https://api.openai.com/v1'
      : this.config.get<string>('AI_EMBEDDING_BASE_URL', '').trim();
    if (!baseUrl) throw new ServiceUnavailableException('AI_EMBEDDING_BASE_URL is not configured');
    const key = backend === 'openai'
      ? this.config.get<string>('OPENAI_API_KEY', '')
      : this.config.get<string>('AI_EMBEDDING_API_KEY', '');
    if (backend === 'openai' && !key) throw new ServiceUnavailableException('OPENAI_API_KEY is not configured');

    let response: Response;
    try {
      response = await fetch(`${baseUrl.replace(/\/+$/, '')}/embeddings`, {
        method: 'POST',
        signal: AbortSignal.timeout(this.config.get<number>('AI_TIMEOUT_MS', 30_000)),
        headers: { 'content-type': 'application/json', ...(key ? { authorization: `Bearer ${key}` } : {}) },
        body: JSON.stringify({ model: this.config.get<string>('AI_EMBEDDING_MODEL'), input }),
      });
    } catch (error) {
      const name = (error as { name?: string } | undefined)?.name;
      if (name === 'AbortError' || name === 'TimeoutError') throw new GatewayTimeoutException('Embedding provider request timed out');
      throw new BadGatewayException('Embedding provider request failed');
    }
    if (!response.ok) throw new BadGatewayException(`Embedding provider failed with status ${response.status}`);
    let body: { data?: Array<{ embedding?: unknown }> };
    try {
      body = await response.json() as typeof body;
    } catch {
      throw new BadGatewayException('Embedding provider returned an invalid response');
    }
    const embedding = body.data?.[0]?.embedding;
    if (!Array.isArray(embedding) || !embedding.length || !embedding.every((value) => typeof value === 'number' && Number.isFinite(value))) {
      throw new BadGatewayException('Embedding provider returned no vector');
    }
    return embedding as number[];
  }
}
