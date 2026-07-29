import { Module } from '@nestjs/common';
import { ReportsController, UserBlocksController } from './trust-safety.controller.js';
import { TrustSafetyService } from './trust-safety.service.js';

@Module({
  controllers: [UserBlocksController, ReportsController],
  providers: [TrustSafetyService],
  exports: [TrustSafetyService],
})
export class TrustSafetyModule {}
