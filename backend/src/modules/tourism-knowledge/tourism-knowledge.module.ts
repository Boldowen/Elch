import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module.js';
import { TourismKnowledgeController } from './tourism-knowledge.controller.js';
import { TourismIngestionService } from './tourism-ingestion.service.js';
import { TourismRetrievalService } from './tourism-retrieval.service.js';

@Module({ imports: [AiModule], controllers: [TourismKnowledgeController], providers: [TourismIngestionService, TourismRetrievalService], exports: [TourismIngestionService, TourismRetrievalService] })
export class TourismKnowledgeModule {}
