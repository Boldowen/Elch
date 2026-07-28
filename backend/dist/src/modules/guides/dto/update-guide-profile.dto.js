var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsEnum, IsObject, IsOptional, IsString, MinLength, } from 'class-validator';
import { PricingType } from '../../../generated/prisma/client.js';
export class UpdateGuideProfileDto {
    name;
    country;
    city;
    bio;
    languages;
    expertise;
    availability;
    pricingType;
    price;
}
__decorate([
    IsOptional(),
    IsString(),
    MinLength(2),
    __metadata("design:type", String)
], UpdateGuideProfileDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateGuideProfileDto.prototype, "country", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateGuideProfileDto.prototype, "city", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MinLength(40),
    __metadata("design:type", String)
], UpdateGuideProfileDto.prototype, "bio", void 0);
__decorate([
    IsOptional(),
    IsObject(),
    __metadata("design:type", Object)
], UpdateGuideProfileDto.prototype, "languages", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    __metadata("design:type", Array)
], UpdateGuideProfileDto.prototype, "expertise", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    __metadata("design:type", Array)
], UpdateGuideProfileDto.prototype, "availability", void 0);
__decorate([
    IsOptional(),
    IsEnum(PricingType),
    __metadata("design:type", String)
], UpdateGuideProfileDto.prototype, "pricingType", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateGuideProfileDto.prototype, "price", void 0);
//# sourceMappingURL=update-guide-profile.dto.js.map