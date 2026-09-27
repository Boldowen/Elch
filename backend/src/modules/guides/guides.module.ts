import { Module } from '@nestjs/common';
import { GuidesController } from './guides.controller.js';
import { GuidesService } from './guides.service.js';
import { StorageModule } from '../storage/storage.module.js';
import { GuideEvidenceController } from './guide-evidence.controller.js';
import { GuideEvidenceService } from './guide-evidence.service.js';
import { GuideAvailabilityController } from './guide-availability.controller.js';
import { GuideAvailabilityService } from './guide-availability.service.js';

@Module({
  imports: [StorageModule],
  controllers: [GuidesController, GuideEvidenceController, GuideAvailabilityController],
  providers: [GuidesService, GuideEvidenceService, GuideAvailabilityService],
})
export class GuidesModule {}
