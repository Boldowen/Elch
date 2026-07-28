var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
export class CreatePostDto {
    text;
    location;
    imageUrls;
}
__decorate([
    ApiProperty({ maxLength: 2000 }),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], CreatePostDto.prototype, "text", void 0);
__decorate([
    ApiPropertyOptional({ maxLength: 120 }),
    IsOptional(),
    IsString(),
    MaxLength(120),
    __metadata("design:type", String)
], CreatePostDto.prototype, "location", void 0);
__decorate([
    ApiPropertyOptional({ type: [String], maxItems: 4 }),
    IsOptional(),
    IsArray(),
    ArrayMaxSize(4),
    IsUrl({}, { each: true }),
    __metadata("design:type", Array)
], CreatePostDto.prototype, "imageUrls", void 0);
//# sourceMappingURL=create-post.dto.js.map