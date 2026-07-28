var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
export var GuideReviewDecision;
(function (GuideReviewDecision) {
    GuideReviewDecision["APPROVE"] = "APPROVE";
    GuideReviewDecision["REJECT"] = "REJECT";
})(GuideReviewDecision || (GuideReviewDecision = {}));
export class ReviewGuideApplicationDto {
    decision;
    assessmentScore;
}
__decorate([
    IsEnum(GuideReviewDecision),
    __metadata("design:type", String)
], ReviewGuideApplicationDto.prototype, "decision", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(0),
    Max(100),
    __metadata("design:type", Number)
], ReviewGuideApplicationDto.prototype, "assessmentScore", void 0);
//# sourceMappingURL=review-guide-application.dto.js.map