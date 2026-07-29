var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ReportsController, UserBlocksController } from './trust-safety.controller.js';
import { TrustSafetyService } from './trust-safety.service.js';
let TrustSafetyModule = class TrustSafetyModule {
};
TrustSafetyModule = __decorate([
    Module({
        controllers: [UserBlocksController, ReportsController],
        providers: [TrustSafetyService],
        exports: [TrustSafetyService],
    })
], TrustSafetyModule);
export { TrustSafetyModule };
//# sourceMappingURL=trust-safety.module.js.map