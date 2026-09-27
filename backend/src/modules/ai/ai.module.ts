import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AI_PROVIDER } from './ai-provider.interface.js';
import { ExperimentModeService } from './experiment-mode.service.js';
import { LocalSafeAiProvider } from './local-safe.provider.js';
import { OpenAiCompatibleProvider } from './openai-compatible.provider.js';
import { ToolRegistryService } from './tools/tool-registry.service.js';
import { RoutePlanningModule } from '../route-planning/route-planning.module.js';
import { BookingsModule } from '../bookings/bookings.module.js';
import {
  DeterministicMockLiveDataProvider,
  DisabledLiveDataProvider,
  SafeLiveHttpClient,
  VerifiedHttpLiveDataProvider,
} from './live/live-data.providers.js';
import { LIVE_DATA_PROVIDER } from './live/live-data.types.js';
import { LiveDataService } from './live/live-data.service.js';
import { AssistantRuntimeService } from './assistant-runtime.service.js';
import { GuideResearchModule } from '../guide-research/guide-research.module.js';
import { EmbeddingService } from './embedding.service.js';
import { ModelRouterService } from './model-router.service.js';
import { AnthropicAiProvider } from './anthropic/anthropic.provider.js';
import { ClaudeAssistantRuntime } from './anthropic/claude-assistant.runtime.js';
import { ANTHROPIC_CLIENT, ClaudeMessagesService, createAnthropicClient } from './anthropic/claude-messages.service.js';

@Module({
  imports: [RoutePlanningModule, BookingsModule, GuideResearchModule],
  providers: [
    ExperimentModeService,
    EmbeddingService,
    ModelRouterService,
    { provide: ANTHROPIC_CLIENT, inject: [ConfigService], useFactory: createAnthropicClient },
    ClaudeMessagesService,
    ClaudeAssistantRuntime,
    LocalSafeAiProvider,
    OpenAiCompatibleProvider,
    AnthropicAiProvider,
    SafeLiveHttpClient,
    DisabledLiveDataProvider,
    DeterministicMockLiveDataProvider,
    VerifiedHttpLiveDataProvider,
    {
      provide: LIVE_DATA_PROVIDER,
      inject: [ConfigService, DisabledLiveDataProvider, DeterministicMockLiveDataProvider, VerifiedHttpLiveDataProvider],
      useFactory: (
        config: ConfigService,
        disabled: DisabledLiveDataProvider,
        mock: DeterministicMockLiveDataProvider,
        live: VerifiedHttpLiveDataProvider,
      ) => {
        const mode = config.get<string>('LIVE_DATA_MODE', 'disabled');
        return mode === 'mock' ? mock : mode === 'live' ? live : disabled;
      },
    },
    LiveDataService,
    ToolRegistryService,
    AssistantRuntimeService,
    {
      provide: AI_PROVIDER,
      inject: [ConfigService, LocalSafeAiProvider, OpenAiCompatibleProvider, AnthropicAiProvider],
      useFactory: (
        config: ConfigService,
        local: LocalSafeAiProvider,
        openai: OpenAiCompatibleProvider,
        anthropic: AnthropicAiProvider,
      ) => {
        const provider = config.get<string>('AI_PROVIDER', 'local');
        return provider === 'anthropic' ? anthropic : provider === 'openai' ? openai : local;
      },
    },
  ],
  exports: [
    AI_PROVIDER,
    ExperimentModeService,
    EmbeddingService,
    ModelRouterService,
    ToolRegistryService,
    LiveDataService,
    AssistantRuntimeService,
  ],
})
export class AiModule {}
