import { Module } from '@nestjs/common';
import { GuideAssessmentsController } from './guide-assessments.controller.js';
import { GuideAssessmentsService } from './guide-assessments.service.js';
import { LanguageAssessmentService } from './language-assessment.service.js';
import { AiModule } from '../ai/ai.module.js';

@Module({ imports: [AiModule], controllers: [GuideAssessmentsController], providers: [GuideAssessmentsService, LanguageAssessmentService], exports: [GuideAssessmentsService, LanguageAssessmentService] })
export class GuideAssessmentsModule {}
