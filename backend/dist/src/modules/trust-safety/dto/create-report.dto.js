var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ReportReason, ReportTargetType } from '../../../generated/prisma/client.js';
export class CreateReportDto {
    reason;
    targetType;
    targetId;
    details;
}
__decorate([
    IsEnum(ReportReason),
    __metadata("design:type", String)
], CreateReportDto.prototype, "reason", void 0);
__decorate([
    IsEnum(ReportTargetType),
    __metadata("design:type", String)
], CreateReportDto.prototype, "targetType", void 0);
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "targetId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MinLength(3),
    MaxLength(2000),
    __metadata("design:type", String)
], CreateReportDto.prototype, "details", void 0);
//# sourceMappingURL=create-report.dto.js.map