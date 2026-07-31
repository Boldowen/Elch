var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Headers, Ip, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Throttle } from '@nestjs/throttler';
import { ResendVerificationDto, VerifyEmailDto } from './dto/verify-email.dto.js';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/password-recovery.dto.js';
import { SocialLoginDto } from './dto/social-login.dto.js';
let AuthController = class AuthController {
    auth;
    constructor(auth) {
        this.auth = auth;
    }
    register(dto, ua, ip) { return this.auth.register(dto, { userAgent: ua, ip }); }
    login(dto, ua, ip) { return this.auth.login(dto, { userAgent: ua, ip }); }
    socialLogin(dto, ua, ip) {
        return this.auth.socialLogin(dto, { userAgent: ua, ip });
    }
    refresh(dto, ua, ip) { return this.auth.refresh(dto.refreshToken, { userAgent: ua, ip }); }
    logout(dto) { return this.auth.logout(dto.refreshToken); }
    verifyEmail(dto) { return this.auth.verifyEmail(dto.token); }
    resendVerification(dto) { return this.auth.resendVerification(dto.email); }
    forgotPassword(dto) { return this.auth.forgotPassword(dto.email); }
    resetPassword(dto) { return this.auth.resetPassword(dto.token, dto.newPassword); }
    changePassword(user, dto) {
        return this.auth.changePassword(user.sub, dto.currentPassword, dto.newPassword);
    }
    logoutAll(user) { return this.auth.logoutAll(user.sub); }
};
__decorate([
    Public(),
    Post('register'),
    __param(0, Body()),
    __param(1, Headers('user-agent')),
    __param(2, Ip()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto, String, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    Public(),
    Post('login'),
    __param(0, Body()),
    __param(1, Headers('user-agent')),
    __param(2, Ip()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, String, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    Public(),
    Throttle({ default: { limit: 10, ttl: 60_000 } }),
    Post('social'),
    __param(0, Body()),
    __param(1, Headers('user-agent')),
    __param(2, Ip()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SocialLoginDto, String, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "socialLogin", null);
__decorate([
    Public(),
    Post('refresh'),
    __param(0, Body()),
    __param(1, Headers('user-agent')),
    __param(2, Ip()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshDto, String, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    Public(),
    Post('logout'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    Public(),
    Throttle({ default: { limit: 10, ttl: 60_000 } }),
    Post('verify-email'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyEmailDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    Public(),
    Throttle({ default: { limit: 3, ttl: 60_000 } }),
    Post('resend-verification'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResendVerificationDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resendVerification", null);
__decorate([
    Public(),
    Throttle({ default: { limit: 3, ttl: 60_000 } }),
    Post('forgot-password'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    Public(),
    Throttle({ default: { limit: 5, ttl: 60_000 } }),
    Post('reset-password'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    Post('change-password'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ChangePasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changePassword", null);
__decorate([
    Post('logout-all'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logoutAll", null);
AuthController = __decorate([
    ApiTags('auth'),
    Controller({ path: 'auth', version: '1' }),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map