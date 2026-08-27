import { Module } from '@nestjs/common';
import { GuideResearchController } from './guide-research.controller.js';
import { GuideResearchService } from './guide-research.service.js';

@Module({
  controllers: [GuideResearchController],
  providers: [GuideResearchService],
  exports: [GuideResearchService],
})
export class GuideResearchModule {}
