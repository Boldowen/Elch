import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService, private readonly config: ConfigService) {}

  async register(dto: RegisterDto, meta: { userAgent?: string; ip?: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (exists) throw new ConflictException('Email is already registered');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name.trim(),
        passwordHash,
        // Selecting “Be a guide” is an application intent, not approval.
        // GUIDE is granted only after the guide quality checks pass.
        roles: [Role.TRAVELER],
      },
    });
    return this.issueSession(user, meta);
  }

  async login(dto: LoginDto, meta: { userAgent?: string; ip?: string }) {
    const user = await this.prisma.user.findFirst({ where: { email: dto.email.toLowerCase(), deletedAt: null } });
    if (!user?.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Incorrect email or password');
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.issueSession(user, meta);
  }

  async refresh(refreshToken: string, meta: { userAgent?: string; ip?: string }) {
    let payload: { sub: string; jti: string; family: string };
    try { payload = await this.jwt.verifyAsync(refreshToken, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET') }); }
    catch { throw new UnauthorizedException('Invalid refresh token'); }
    const record = await this.prisma.refreshToken.findUnique({ where: { id: payload.jti }, include: { user: true } });
    if (!record || record.revokedAt || record.expiresAt < new Date() || !(await bcrypt.compare(refreshToken, record.tokenHash))) {
      await this.prisma.refreshToken.updateMany({ where: { family: payload.family, revokedAt: null }, data: { revokedAt: new Date() } });
      throw new UnauthorizedException('Refresh token expired or reused');
    }
    await this.prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } });
    return this.issueSession(record.user, meta, payload.family);
  }

  async logout(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ jti: string }>(refreshToken, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET') });
      await this.prisma.refreshToken.updateMany({ where: { id: payload.jti }, data: { revokedAt: new Date() } });
    } catch { /* idempotent */ }
    return { success: true };
  }

  async logoutAll(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  private async issueSession(user: { id: string; email: string; name: string; roles: string[]; avatarUrl: string | null }, meta: { userAgent?: string; ip?: string }, family: string = randomUUID()) {
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, roles: user.roles }, { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: this.config.get('JWT_ACCESS_TTL', '15m') as any });
    const tokenId = randomUUID();
    const refreshToken = await this.jwt.signAsync({ sub: user.id, jti: tokenId, family }, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET'), expiresIn: this.config.get('JWT_REFRESH_TTL', '30d') as any });
    const decoded = this.jwt.decode(refreshToken) as { exp: number };
    await this.prisma.refreshToken.create({ data: { id: tokenId, family, userId: user.id, tokenHash: await bcrypt.hash(refreshToken, 10), expiresAt: new Date(decoded.exp * 1000), userAgent: meta.userAgent, ipAddress: meta.ip } });
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, roles: user.roles, avatarUrl: user.avatarUrl } };
  }
}
