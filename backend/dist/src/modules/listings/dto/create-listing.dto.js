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
import { ArrayMaxSize, IsArray, IsEnum, IsInt, IsISO4217CurrencyCode, IsString, IsUrl, Max, MaxLength, Min, MinLength, ValidateNested, } from 'class-validator';
import { ListingCategory, PriceUnit } from '../../../generated/prisma/client.js';
class ListingImageDto {
    url;
    alt = '';
}
__decorate([
    IsUrl({ protocols: ['https'], require_protocol: true }),
    __metadata("design:type", String)
], ListingImageDto.prototype, "url", void 0);
__decorate([
    IsString(),
    MaxLength(300),
    __metadata("design:type", String)
], ListingImageDto.prototype, "alt", void 0);
export class CreateListingDto {
    title;
    location;
    description;
    category;
    basePriceMinor;
    cleaningFeeMinor = 0;
    serviceFeeMinor = 0;
    taxMinor = 0;
    extraGuestFeeMinor = 0;
    depositMinor = 0;
    currency = 'USD';
    priceUnit;
    datesLabel = 'Flexible dates';
    tags = [];
    amenities = [];
    defaultTotalUnits = 1;
    images = [];
}
__decorate([
    IsString(),
    MinLength(3),
    MaxLength(140),
    __metadata("design:type", String)
], CreateListingDto.prototype, "title", void 0);
__decorate([
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], CreateListingDto.prototype, "location", void 0);
__decorate([
    IsString(),
    MinLength(20),
    MaxLength(5000),
    __metadata("design:type", String)
], CreateListingDto.prototype, "description", void 0);
__decorate([
    IsEnum(ListingCategory),
    __metadata("design:type", String)
], CreateListingDto.prototype, "category", void 0);
__decorate([
    IsInt(),
    Min(1),
    Max(2_000_000_000),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "basePriceMinor", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(2_000_000_000),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "cleaningFeeMinor", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(2_000_000_000),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "serviceFeeMinor", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(2_000_000_000),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "taxMinor", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(2_000_000_000),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "extraGuestFeeMinor", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(2_000_000_000),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "depositMinor", void 0);
__decorate([
    IsISO4217CurrencyCode(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "currency", void 0);
__decorate([
    IsEnum(PriceUnit),
    __metadata("design:type", String)
], CreateListingDto.prototype, "priceUnit", void 0);
__decorate([
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateListingDto.prototype, "datesLabel", void 0);
__decorate([
    IsArray(),
    ArrayMaxSize(20),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateListingDto.prototype, "tags", void 0);
__decorate([
    IsArray(),
    ArrayMaxSize(50),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateListingDto.prototype, "amenities", void 0);
__decorate([
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "defaultTotalUnits", void 0);
__decorate([
    IsArray(),
    ArrayMaxSize(10),
    ValidateNested({ each: true }),
    Type(() => ListingImageDto),
    __metadata("design:type", Array)
], CreateListingDto.prototype, "images", void 0);
//# sourceMappingURL=create-listing.dto.js.map