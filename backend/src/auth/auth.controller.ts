import { Body, Controller, Headers, Ip, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator.js';
import { Throttle } from '@nestjs/throttler';
import { ResendVerificationDto, VerifyEmailDto } from './dto/verify-email.dto.js';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/password-recovery.dto.js';
import { SocialLoginDto } from './dto/social-login.dto.js';
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Public() @Post('register') register(@Body() dto: RegisterDto, @Headers('user-agent') ua: string, @Ip() ip: string) { return this.auth.register(dto, { userAgent: ua, ip }); }
  @Public() @Post('login') login(@Body() dto: LoginDto, @Headers('user-agent') ua: string, @Ip() ip: string) { return this.auth.login(dto, { userAgent: ua, ip }); }
  @Public() @Throttle({ default: { limit: 10, ttl: 60_000 } }) @Post('social')
  socialLogin(@Body() dto: SocialLoginDto, @Headers('user-agent') ua: string, @Ip() ip: string) {
    return this.auth.socialLogin(dto, { userAgent: ua, ip });
  }
  @Public() @Post('refresh') refresh(@Body() dto: RefreshDto, @Headers('user-agent') ua: string, @Ip() ip: string) { return this.auth.refresh(dto.refreshToken, { userAgent: ua, ip }); }
  @Public() @Post('logout') logout(@Body() dto: RefreshDto) { return this.auth.logout(dto.refreshToken); }
  @Public() @Throttle({ default: { limit: 10, ttl: 60_000 } }) @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) { return this.auth.verifyEmail(dto.token); }
  @Public() @Throttle({ default: { limit: 3, ttl: 60_000 } }) @Post('resend-verification')
  resendVerification(@Body() dto: ResendVerificationDto) { return this.auth.resendVerification(dto.email); }
  @Public() @Throttle({ default: { limit: 3, ttl: 60_000 } }) @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) { return this.auth.forgotPassword(dto.email); }
  @Public() @Throttle({ default: { limit: 5, ttl: 60_000 } }) @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) { return this.auth.resetPassword(dto.token, dto.newPassword); }
  @Post('change-password')
  changePassword(@CurrentUser() user: RequestUser, @Body() dto: ChangePasswordDto) {
    return this.auth.changePassword(user.sub, dto.currentPassword, dto.newPassword);
  }
  @Post('logout-all') logoutAll(@CurrentUser() user: RequestUser) { return this.auth.logoutAll(user.sub); }
}
