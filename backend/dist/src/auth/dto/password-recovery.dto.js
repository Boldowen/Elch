var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
export class ForgotPasswordDto {
    email;
}
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
export class ResetPasswordDto {
    token;
    newPassword;
}
__decorate([
    IsString(),
    Length(64, 64),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    IsString(),
    MinLength(8),
    MaxLength(64),
    Matches(STRONG_PASSWORD, { message: 'Password must include uppercase, lowercase, and a number' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
export class ChangePasswordDto {
    currentPassword;
    newPassword;
}
__decorate([
    IsString(),
    MaxLength(64),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    IsString(),
    MinLength(8),
    MaxLength(64),
    Matches(STRONG_PASSWORD, { message: 'Password must include uppercase, lowercase, and a number' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
//# sourceMappingURL=password-recovery.dto.js.map