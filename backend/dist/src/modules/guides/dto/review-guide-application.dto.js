var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateIf, ValidateNested, } from 'class-validator';
import { VerificationCheckStatus } from '../../../generated/prisma/client.js';
export var GuideReviewDecision;
(function (GuideReviewDecision) {
    GuideReviewDecision["APPROVE"] = "APPROVE";
    GuideReviewDecision["REJECT"] = "REJECT";
})(GuideReviewDecision || (GuideReviewDecision = {}));
export class AssessmentBreakdownDto {
    localKnowledge;
    communication;
    safety;
    professionalism;
}
__decorate([
    IsInt(),
    Min(0),
    Max(25),
    __metadata("design:type", Number)
], AssessmentBreakdownDto.prototype, "localKnowledge", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(25),
    __metadata("design:type", Number)
], AssessmentBreakdownDto.prototype, "communication", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(25),
    __metadata("design:type", Number)
], AssessmentBreakdownDto.prototype, "safety", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(25),
    __metadata("design:type", Number)
], AssessmentBreakdownDto.prototype, "professionalism", void 0);
export class ReviewGuideApplicationDto {
    decision;
    decisionReason;
    internalNote;
    assessmentBreakdown;
    documentStatus;
    referenceStatus;
}
__decorate([
    IsEnum(GuideReviewDecision),
    __metadata("design:type", String)
], ReviewGuideApplicationDto.prototype, "decision", void 0);
__decorate([
    ValidateIf((dto) => dto.decision === GuideReviewDecision.REJECT),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], ReviewGuideApplicationDto.prototype, "decisionReason", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], ReviewGuideApplicationDto.prototype, "internalNote", void 0);
__decorate([
    ValidateNested(),
    Type(() => AssessmentBreakdownDto),
    __metadata("design:type", AssessmentBreakdownDto)
], ReviewGuideApplicationDto.prototype, "assessmentBreakdown", void 0);
__decorate([
    IsEnum(VerificationCheckStatus),
    __metadata("design:type", String)
], ReviewGuideApplicationDto.prototype, "documentStatus", void 0);
__decorate([
    IsEnum(VerificationCheckStatus),
    __metadata("design:type", String)
], ReviewGuideApplicationDto.prototype, "referenceStatus", void 0);
//# sourceMappingURL=review-guide-application.dto.js.map