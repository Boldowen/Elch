var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { GuidesController } from './guides.controller.js';
import { GuidesService } from './guides.service.js';
import { StorageModule } from '../storage/storage.module.js';
import { GuideEvidenceController } from './guide-evidence.controller.js';
import { GuideEvidenceService } from './guide-evidence.service.js';
let GuidesModule = class GuidesModule {
};
GuidesModule = __decorate([
    Module({
        imports: [StorageModule],
        controllers: [GuidesController, GuideEvidenceController],
        providers: [GuidesService, GuideEvidenceService],
    })
], GuidesModule);
export { GuidesModule };
//# sourceMappingURL=guides.module.js.map