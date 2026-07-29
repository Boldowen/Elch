var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsInt, IsString, Max, MaxLength, Min, ValidateIf } from 'class-validator';
import { ModerationActionType } from '../../../generated/prisma/client.js';
export class ModerateReportDto {
    action;
    reason;
    durationHours;
}
__decorate([
    IsEnum(ModerationActionType),
    __metadata("design:type", String)
], ModerateReportDto.prototype, "action", void 0);
__decorate([
    IsString(),
    MaxLength(1000),
    __metadata("design:type", String)
], ModerateReportDto.prototype, "reason", void 0);
__decorate([
    ValidateIf((dto) => dto.action === ModerationActionType.TEMPORARY_SUSPENSION),
    IsInt(),
    Min(1),
    Max(8760),
    __metadata("design:type", Number)
], ModerateReportDto.prototype, "durationHours", void 0);
export class DismissReportDto {
    reason;
}
__decorate([
    IsString(),
    MaxLength(1000),
    __metadata("design:type", String)
], DismissReportDto.prototype, "reason", void 0);
//# sourceMappingURL=moderate-report.dto.js.map