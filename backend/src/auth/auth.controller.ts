import { Body, Controller, Headers, Ip, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator.js';
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Public() @Post('register') register(@Body() dto: RegisterDto, @Headers('user-agent') ua: string, @Ip() ip: string) { return this.auth.register(dto, { userAgent: ua, ip }); }
  @Public() @Post('login') login(@Body() dto: LoginDto, @Headers('user-agent') ua: string, @Ip() ip: string) { return this.auth.login(dto, { userAgent: ua, ip }); }
  @Public() @Post('refresh') refresh(@Body() dto: RefreshDto, @Headers('user-agent') ua: string, @Ip() ip: string) { return this.auth.refresh(dto.refreshToken, { userAgent: ua, ip }); }
  @Public() @Post('logout') logout(@Body() dto: RefreshDto) { return this.auth.logout(dto.refreshToken); }
  @Post('logout-all') logoutAll(@CurrentUser() user: RequestUser) { return this.auth.logoutAll(user.sub); }
}
