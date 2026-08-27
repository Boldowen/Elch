import { BadGatewayException, GatewayTimeoutException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jest } from '@jest/globals';
import { OpenAiCompatibleProvider } from '../src/modules/ai/openai-compatible.provider.js';

const secretKey = 'sk-test-must-never-leak';
const privatePrompt = 'private user body must-never-leak';
const upstreamBody = 'upstream diagnostic must-never-leak';

function provider(apiKey = secretKey) {
  return new OpenAiCompatibleProvider(new ConfigService({
    OPENAI_API_KEY: apiKey,
    AI_DEFAULT_MODEL: 'test-model',
    AI_EMBEDDING_MODEL: 'test-embedding-model',
    AI_TIMEOUT_MS: 50,
  }));
}

function exposedError(error: unknown) {
  expect(error).toBeInstanceOf(Error);
  const nestError = error as BadGatewayException;
  return JSON.stringify(nestError.getResponse());
}

describe('OpenAI-compatible provider failure safety', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns a safe Nest error without calling fetch when the API key is missing', async () => {
    const fetchMock = jest.spyOn(globalThis, 'fetch');
    const error = await provider('').generateText({ system: 'system', prompt: privatePrompt }).catch((failure: unknown) => failure);

    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as ServiceUnavailableException).getStatus()).toBe(503);
    expect(exposedError(error)).not.toContain(privatePrompt);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not expose an upstream response body, API key, or request body', async () => {
    const json = jest.fn(async () => ({ error: upstreamBody }));
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 429, json } as unknown as Response);
    const error = await provider().generateText({ system: 'system', prompt: privatePrompt }).catch((failure: unknown) => failure);
    const exposed = exposedError(error);

    expect(error).toBeInstanceOf(BadGatewayException);
    expect((error as BadGatewayException).getStatus()).toBe(502);
    expect(exposed).not.toContain(secretKey);
    expect(exposed).not.toContain(privatePrompt);
    expect(exposed).not.toContain(upstreamBody);
    expect(json).not.toHaveBeenCalled();
  });

  it('maps timeout rejections to a sanitized gateway-timeout error', async () => {
    const timeout = new Error(upstreamBody);
    timeout.name = 'TimeoutError';
    jest.spyOn(globalThis, 'fetch').mockRejectedValue(timeout);
    const error = await provider().generateEmbedding(privatePrompt).catch((failure: unknown) => failure);
    const exposed = exposedError(error);

    expect(error).toBeInstanceOf(GatewayTimeoutException);
    expect((error as GatewayTimeoutException).getStatus()).toBe(504);
    expect(exposed).not.toContain(secretKey);
    expect(exposed).not.toContain(privatePrompt);
    expect(exposed).not.toContain(upstreamBody);
  });

  it('maps non-timeout transport failures to a sanitized bad-gateway error', async () => {
    jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error(upstreamBody));
    const error = await provider().generateText({ system: 'system', prompt: privatePrompt }).catch((failure: unknown) => failure);
    const exposed = exposedError(error);

    expect(error).toBeInstanceOf(BadGatewayException);
    expect((error as BadGatewayException).getStatus()).toBe(502);
    expect(exposed).not.toContain(secretKey);
    expect(exposed).not.toContain(privatePrompt);
    expect(exposed).not.toContain(upstreamBody);
  });

  it('retries one transient HTTP failure and then succeeds', async () => {
    const fetchMock = jest.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: false, status: 503 } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          output: [{ type: 'message', content: [{ type: 'output_text', text: 'recovered' }] }],
        }),
      } as Response);

    await expect(provider().generateText({ system: 'system', prompt: privatePrompt }))
      .resolves.toMatchObject({ text: 'recovered' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('extracts text from the raw Responses API output envelope', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        output: [{ type: 'message', content: [{ type: 'output_text', text: 'safe response' }] }],
        usage: { input_tokens: 12, output_tokens: 3 },
      }),
    } as unknown as Response);

    await expect(provider().generateText({ system: 'system', prompt: privatePrompt })).resolves.toEqual({
      text: 'safe response',
      usage: { model: 'test-model', inputTokens: 12, outputTokens: 3, estimatedCostUsd: 0 },
    });
  });

  it('parses structured output from the raw Responses API output envelope', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        output: [{ type: 'message', content: [{ type: 'output_text', text: '{"value":"ok"}' }] }],
      }),
    } as unknown as Response);

    await expect(provider().generateStructuredOutput<{ value: string }>({
      system: 'system',
      prompt: privatePrompt,
      schemaName: 'test_schema',
      jsonSchema: {
        type: 'object',
        additionalProperties: false,
        properties: { value: { type: 'string' } },
        required: ['value'],
      },
    })).resolves.toMatchObject({ data: { value: 'ok' } });
  });
});
