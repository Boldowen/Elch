import { ConfigService } from '@nestjs/config';
import { ExperimentModeService } from '../src/modules/ai/experiment-mode.service.js';
import { LocalSafeAiProvider } from '../src/modules/ai/local-safe.provider.js';

describe('AI foundation', () => {
  it('maps experiment A-E without duplicating pipelines', () => {
    const service = new ExperimentModeService(new ConfigService({ AI_EXPERIMENT_MODE: 'E' }));
    expect(service.current()).toEqual({
      mode: 'E',
      features: { useDomainModel: true, useRag: true, useRouteGraph: true, useTools: true, useValidator: true },
    });
    expect(service.resolve('A').mode).toBe('E');
  });

  it('composes every A-E feature path when controlled overrides are enabled', () => {
    const service = new ExperimentModeService(new ConfigService({
      AI_EXPERIMENT_MODE: 'E',
      AI_ALLOW_EXPERIMENT_OVERRIDE: true,
    }));
    expect(service.resolve('A').features).toEqual({ useDomainModel: false, useRag: false, useRouteGraph: false, useTools: false, useValidator: false });
    expect(service.resolve('B').features).toEqual({ useDomainModel: false, useRag: true, useRouteGraph: false, useTools: false, useValidator: false });
    expect(service.resolve('C').features).toEqual({ useDomainModel: true, useRag: false, useRouteGraph: false, useTools: false, useValidator: false });
    expect(service.resolve('D').features).toEqual({ useDomainModel: true, useRag: true, useRouteGraph: false, useTools: false, useValidator: false });
    expect(service.resolve('E').features).toEqual({ useDomainModel: true, useRag: true, useRouteGraph: true, useTools: true, useValidator: true });
  });

  it('uses deterministic request classification before an extra model call', async () => {
    const provider = new LocalSafeAiProvider();
    await expect(provider.classifyRequest('Find an English Gobi guide')).resolves.toBe('GUIDE_SEARCH');
    await expect(provider.classifyRequest('Translate this message')).resolves.toBe('TRANSLATION');
  });

  it('provides stable local embeddings for development retrieval', async () => {
    const provider = new LocalSafeAiProvider();
    const first = await provider.generateEmbedding('Orkhon heritage Mongolia');
    const second = await provider.generateEmbedding('Orkhon heritage Mongolia');
    expect(first).toEqual(second);
    expect(first).toHaveLength(64);
  });
});
