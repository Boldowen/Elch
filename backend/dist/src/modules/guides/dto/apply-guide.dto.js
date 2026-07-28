var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Equals, IsArray, IsBoolean, IsEnum, IsInt, IsNumberString, IsObject, IsOptional, IsString, Max, Min, MinLength, } from 'class-validator';
import { PricingType } from '../../../generated/prisma/client.js';
export class ApplyGuideDto {
    country;
    city;
    bio;
    experienceYears;
    languages;
    expertise;
    availability;
    pricingType = PricingType.HOURLY;
    price;
    referenceContact;
    codeOfConductAccepted;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], ApplyGuideDto.prototype, "country", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], ApplyGuideDto.prototype, "city", void 0);
__decorate([
    IsString(),
    MinLength(40),
    __metadata("design:type", String)
], ApplyGuideDto.prototype, "bio", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(60),
    __metadata("design:type", Number)
], ApplyGuideDto.prototype, "experienceYears", void 0);
__decorate([
    IsObject(),
    __metadata("design:type", Object)
], ApplyGuideDto.prototype, "languages", void 0);
__decorate([
    IsArray(),
    __metadata("design:type", Array)
], ApplyGuideDto.prototype, "expertise", void 0);
__decorate([
    IsArray(),
    __metadata("design:type", Array)
], ApplyGuideDto.prototype, "availability", void 0);
__decorate([
    IsEnum(PricingType),
    __metadata("design:type", String)
], ApplyGuideDto.prototype, "pricingType", void 0);
__decorate([
    IsOptional(),
    IsNumberString(),
    __metadata("design:type", String)
], ApplyGuideDto.prototype, "price", void 0);
__decorate([
    IsString(),
    MinLength(6),
    __metadata("design:type", String)
], ApplyGuideDto.prototype, "referenceContact", void 0);
__decorate([
    IsBoolean(),
    Equals(true),
    __metadata("design:type", Boolean)
], ApplyGuideDto.prototype, "codeOfConductAccepted", void 0);
//# sourceMappingURL=apply-guide.dto.js.map