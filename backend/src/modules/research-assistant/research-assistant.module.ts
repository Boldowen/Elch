import { Module } from '@nestjs/common';
import { ResearchAssistantController } from './research-assistant.controller.js';
import { ResearchAssistantService } from './research-assistant.service.js';
import { AiModule } from '../ai/ai.module.js';
import { TourismKnowledgeModule } from '../tourism-knowledge/tourism-knowledge.module.js';
import { RoutePlanningModule } from '../route-planning/route-planning.module.js';
import { GuideResearchModule } from '../guide-research/guide-research.module.js';

@Module({
  imports: [AiModule, TourismKnowledgeModule, RoutePlanningModule, GuideResearchModule],
  controllers: [ResearchAssistantController],
  providers: [ResearchAssistantService],
})
export class ResearchAssistantModule {}
