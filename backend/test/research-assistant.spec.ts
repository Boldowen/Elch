import { jest } from '@jest/globals';
import { ResearchAssistantService } from '../src/modules/research-assistant/research-assistant.service.js';
import { LocalSafeAiProvider } from '../src/modules/ai/local-safe.provider.js';
import { ExperimentModeService } from '../src/modules/ai/experiment-mode.service.js';
import { ConfigService } from '@nestjs/config';

describe('ResearchAssistantService', () => {
  const assistant = new ResearchAssistantService(
    new LocalSafeAiProvider(),
    new ExperimentModeService(new ConfigService({ AI_EXPERIMENT_MODE: 'E' })),
  );

  it('grounds a Gobi request in RouteGraph and sources', async () => {
    const result = await assistant.query({ message: 'Говийн маршрут гаргаж өгөөч', language: 'mn' });
    expect(result.intent).toBe('ITINERARY');
    expect(result.route?.id).toBe('gobi');
    expect(result.citations.length).toBeGreaterThan(0);
  });

  it('does not invent dynamic weather data', async () => {
    const result = await assistant.query({ message: 'Khuvsgul weather and road closure?', language: 'en' });
    expect(result.suggestedTools).toEqual(expect.arrayContaining(['getLiveWeather', 'getRoadClosures']));
    expect(result.limitations.join(' ')).toContain('not invented');
  });

  it('changes architecture features by experiment mode without changing code paths', async () => {
    const modeA = new ResearchAssistantService(
      new LocalSafeAiProvider(),
      new ExperimentModeService(new ConfigService({ AI_EXPERIMENT_MODE: 'A' })),
    );
    const result = await modeA.query({ message: 'Plan a 7 day Gobi trip for 2 people with $1500 budget', language: 'en' });
    expect(result.experiment.mode).toBe('A');
    expect(result.route).toBeNull();
    expect(result.constraints).toMatchObject({ days: 7, groupSize: 2, budgetUsd: 1500 });
  });

  it('does not expose another user conversation', async () => {
    const isolated = new ResearchAssistantService(
      new LocalSafeAiProvider(),
      new ExperimentModeService(new ConfigService({ AI_EXPERIMENT_MODE: 'E' })),
      { aiConversation: { findFirst: async () => null } } as never,
    );
    await expect(isolated.conversation('user-a', '00000000-0000-4000-8000-000000000001')).rejects.toMatchObject({ status: 404 });
  });

  it('uses verified guide matching rather than returning a placeholder array', async () => {
    const tools = { execute: jest.fn().mockResolvedValue({ tool: 'getRouteDetails', data: {} }) };
    const guideResearch = {
      match: jest.fn().mockResolvedValue({
        matchRunId: 'match-run-1',
        eligible: [{ guideId: 'guide-1', eligible: true, hardGateFailures: [] }],
      }),
    };
    const integrated = new ResearchAssistantService(
      new LocalSafeAiProvider(),
      new ExperimentModeService(new ConfigService({ AI_EXPERIMENT_MODE: 'E' })),
      undefined,
      undefined,
      undefined,
      tools as never,
      guideResearch as never,
    );

    const result = await integrated.query({
      message: 'Match a verified English guide for the western Altai',
      language: 'en',
      routeId: 'western-altai',
    }, '00000000-0000-4000-8000-000000000001');

    expect(guideResearch.match).toHaveBeenCalledWith(expect.objectContaining({
      routeId: 'western-altai', language: 'en', minimumLanguageLevel: 'B2',
    }), '00000000-0000-4000-8000-000000000001');
    expect(result.guideMatches).toEqual([
      expect.objectContaining({ guideId: 'guide-1', eligible: true }),
    ]);
    expect(result.guideMatchRunId).toBe('match-run-1');
    expect(result.executedTools).toContain('matchGuides');
  });
});
