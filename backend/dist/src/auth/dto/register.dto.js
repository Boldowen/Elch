var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Role } from '../../generated/prisma/client.js';
export class RegisterDto {
    name;
    email;
    password;
    role = Role.TRAVELER;
}
__decorate([
    ApiProperty({ example: 'Anu Batsaikhan' }),
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ example: 'anu@example.com' }),
    IsEmail(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ minLength: 8 }),
    IsString(),
    MinLength(8),
    MaxLength(64),
    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, { message: 'Password must include uppercase, lowercase, and a number' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    ApiProperty({ enum: Role, default: Role.TRAVELER }),
    IsEnum(Role),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
//# sourceMappingURL=register.dto.js.map