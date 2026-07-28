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
import { ArrayMaxSize, IsArray, IsDateString, IsInt, Max, Min, ValidateNested } from 'class-validator';
class InventoryDayDto {
    date;
    totalUnits;
}
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], InventoryDayDto.prototype, "date", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(100),
    __metadata("design:type", Number)
], InventoryDayDto.prototype, "totalUnits", void 0);
export class SetInventoryDto {
    days;
}
__decorate([
    IsArray(),
    ArrayMaxSize(366),
    ValidateNested({ each: true }),
    Type(() => InventoryDayDto),
    __metadata("design:type", Array)
], SetInventoryDto.prototype, "days", void 0);
//# sourceMappingURL=set-inventory.dto.js.map