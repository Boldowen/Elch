import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { ExperimentRunService } from './experiment-run.service.js';
import { ResearchController } from './research.controller.js';
import { ResearchService } from './research.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ResearchController],
  providers: [ResearchService, ExperimentRunService],
  exports: [ExperimentRunService],
})
export class ResearchModule {}
