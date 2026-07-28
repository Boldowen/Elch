var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async register(dto, meta) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
        if (exists)
            throw new ConflictException('Email is already registered');
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                name: dto.name.trim(),
                passwordHash,
                roles: [Role.TRAVELER],
            },
        });
        return this.issueSession(user, meta);
    }
    async login(dto, meta) {
        const user = await this.prisma.user.findFirst({ where: { email: dto.email.toLowerCase(), deletedAt: null } });
        if (!user?.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash)))
            throw new UnauthorizedException('Incorrect email or password');
        await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        return this.issueSession(user, meta);
    }
    async refresh(refreshToken, meta) {
        let payload;
        try {
            payload = await this.jwt.verifyAsync(refreshToken, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET') });
        }
        catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
        const record = await this.prisma.refreshToken.findUnique({ where: { id: payload.jti }, include: { user: true } });
        if (!record || record.revokedAt || record.expiresAt < new Date() || !(await bcrypt.compare(refreshToken, record.tokenHash))) {
            await this.prisma.refreshToken.updateMany({ where: { family: payload.family, revokedAt: null }, data: { revokedAt: new Date() } });
            throw new UnauthorizedException('Refresh token expired or reused');
        }
        await this.prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } });
        return this.issueSession(record.user, meta, payload.family);
    }
    async logout(refreshToken) {
        try {
            const payload = await this.jwt.verifyAsync(refreshToken, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET') });
            await this.prisma.refreshToken.updateMany({ where: { id: payload.jti }, data: { revokedAt: new Date() } });
        }
        catch { }
        return { success: true };
    }
    async logoutAll(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
        return { success: true };
    }
    async issueSession(user, meta, family = randomUUID()) {
        const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, roles: user.roles }, { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: this.config.get('JWT_ACCESS_TTL', '15m') });
        const tokenId = randomUUID();
        const refreshToken = await this.jwt.signAsync({ sub: user.id, jti: tokenId, family }, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET'), expiresIn: this.config.get('JWT_REFRESH_TTL', '30d') });
        const decoded = this.jwt.decode(refreshToken);
        await this.prisma.refreshToken.create({ data: { id: tokenId, family, userId: user.id, tokenHash: await bcrypt.hash(refreshToken, 10), expiresAt: new Date(decoded.exp * 1000), userAgent: meta.userAgent, ipAddress: meta.ip } });
        return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, roles: user.roles, avatarUrl: user.avatarUrl } };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService, JwtService, ConfigService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map