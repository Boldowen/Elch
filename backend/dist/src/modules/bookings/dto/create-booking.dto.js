var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
export class CreateBookingDto {
    listingId;
    guideId;
    startsAt;
    endsAt;
    guests = 1;
    note;
}
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "listingId", void 0);
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "guideId", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "startsAt", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "endsAt", void 0);
__decorate([
    IsInt(),
    Min(1),
    Max(30),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "guests", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(1000),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "note", void 0);
export class UpdateBookingDraftDto {
    listingId;
    guideId;
    startsAt;
    endsAt;
    guests;
    note;
    expectedUpdatedAt;
}
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], UpdateBookingDraftDto.prototype, "listingId", void 0);
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], UpdateBookingDraftDto.prototype, "guideId", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateBookingDraftDto.prototype, "startsAt", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateBookingDraftDto.prototype, "endsAt", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1),
    Max(30),
    __metadata("design:type", Number)
], UpdateBookingDraftDto.prototype, "guests", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(1000),
    __metadata("design:type", String)
], UpdateBookingDraftDto.prototype, "note", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateBookingDraftDto.prototype, "expectedUpdatedAt", void 0);
//# sourceMappingURL=create-booking.dto.js.map