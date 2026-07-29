var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller.js';
import { RankingService } from './ranking.service.js';
let RankingModule = class RankingModule {
};
RankingModule = __decorate([
    Module({ controllers: [RankingController], providers: [RankingService], exports: [RankingService] })
], RankingModule);
export { RankingModule };
//# sourceMappingURL=ranking.module.js.map