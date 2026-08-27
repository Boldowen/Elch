import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiExperimentMode, ExperimentFeatures } from './ai.types.js';

const FEATURES: Record<AiExperimentMode, ExperimentFeatures> = {
  A: { useDomainModel: false, useRag: false, useRouteGraph: false, useTools: false, useValidator: false },
  B: { useDomainModel: false, useRag: true, useRouteGraph: false, useTools: false, useValidator: false },
  C: { useDomainModel: true, useRag: false, useRouteGraph: false, useTools: false, useValidator: false },
  D: { useDomainModel: true, useRag: true, useRouteGraph: false, useTools: false, useValidator: false },
  E: { useDomainModel: true, useRag: true, useRouteGraph: true, useTools: true, useValidator: true },
};

@Injectable()
export class ExperimentModeService {
  constructor(private readonly config: ConfigService) {}

  current(): { mode: AiExperimentMode; features: ExperimentFeatures } {
    const mode = this.config.get<AiExperimentMode>('AI_EXPERIMENT_MODE', 'E');
    return { mode, features: FEATURES[mode] };
  }

  resolve(requested?: AiExperimentMode) {
    const allowOverride = this.config.get<boolean>('AI_ALLOW_EXPERIMENT_OVERRIDE', false);
    const mode = requested && allowOverride ? requested : this.current().mode;
    return { mode, features: FEATURES[mode] };
  }
}
