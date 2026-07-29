var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { Role, UserModerationStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EmailDeliveryService } from './email-delivery.service.js';
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    emailDelivery;
    constructor(prisma, jwt, config, emailDelivery) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.emailDelivery = emailDelivery;
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
        let verificationEmailSent = true;
        try {
            await this.createAndSendVerification(user.id, user.email);
        }
        catch {
            verificationEmailSent = false;
        }
        return { ...(await this.issueSession(user, meta)), verificationEmailSent };
    }
    async verifyEmail(token) {
        const tokenHash = this.hashToken(token);
        const now = new Date();
        return this.prisma.$transaction(async (tx) => {
            const record = await tx.emailVerificationToken.findUnique({ where: { tokenHash } });
            if (!record || record.usedAt || record.expiresAt <= now) {
                throw new BadRequestException({ code: 'EMAIL_VERIFICATION_INVALID', message: 'Verification link is invalid or expired' });
            }
            const consumed = await tx.emailVerificationToken.updateMany({
                where: { id: record.id, usedAt: null, expiresAt: { gt: now } },
                data: { usedAt: now },
            });
            if (consumed.count !== 1) {
                throw new BadRequestException({ code: 'EMAIL_VERIFICATION_INVALID', message: 'Verification link is invalid or expired' });
            }
            await tx.user.update({
                where: { id: record.userId },
                data: { emailVerifiedAt: now, isVerified: true },
            });
            await tx.emailVerificationToken.updateMany({
                where: { userId: record.userId, usedAt: null },
                data: { usedAt: now },
            });
            return { success: true, emailVerifiedAt: now };
        });
    }
    async resendVerification(email) {
        const normalizedEmail = email.toLowerCase();
        const user = await this.prisma.user.findFirst({
            where: { email: normalizedEmail, deletedAt: null },
            select: { id: true, email: true, emailVerifiedAt: true },
        });
        if (!user || user.emailVerifiedAt)
            return { success: true };
        const latest = await this.prisma.emailVerificationToken.findFirst({
            where: { userId: user.id },
            orderBy: { sentAt: 'desc' },
            select: { sentAt: true },
        });
        const cooldownMs = this.config.get('EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS', 60) * 1000;
        if (latest && latest.sentAt.getTime() + cooldownMs > Date.now())
            return { success: true };
        try {
            await this.createAndSendVerification(user.id, user.email);
        }
        catch {
        }
        return { success: true };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findFirst({
            where: { email: email.toLowerCase(), deletedAt: null, passwordHash: { not: null } },
            select: { id: true, email: true },
        });
        if (!user)
            return { success: true };
        const latest = await this.prisma.passwordResetToken.findFirst({
            where: { userId: user.id },
            orderBy: { requestedAt: 'desc' },
            select: { requestedAt: true },
        });
        const cooldownMs = this.config.get('PASSWORD_RESET_COOLDOWN_SECONDS', 60) * 1000;
        if (latest && latest.requestedAt.getTime() + cooldownMs > Date.now())
            return { success: true };
        const token = randomBytes(32).toString('hex');
        const now = new Date();
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash: this.hashToken(token),
                requestedAt: now,
                expiresAt: new Date(now.getTime() + 30 * 60_000),
            },
        });
        try {
            await this.emailDelivery.sendPasswordReset(user.email, token);
        }
        catch {
        }
        return { success: true };
    }
    async resetPassword(token, newPassword) {
        const tokenHash = this.hashToken(token);
        const now = new Date();
        const passwordHash = await bcrypt.hash(newPassword, 12);
        return this.prisma.$transaction(async (tx) => {
            const record = await tx.passwordResetToken.findUnique({ where: { tokenHash } });
            if (!record || record.usedAt || record.expiresAt <= now) {
                throw new BadRequestException({ code: 'PASSWORD_RESET_INVALID', message: 'Password reset link is invalid or expired' });
            }
            const consumed = await tx.passwordResetToken.updateMany({
                where: { id: record.id, usedAt: null, expiresAt: { gt: now } },
                data: { usedAt: now },
            });
            if (consumed.count !== 1) {
                throw new BadRequestException({ code: 'PASSWORD_RESET_INVALID', message: 'Password reset link is invalid or expired' });
            }
            await tx.user.update({ where: { id: record.userId }, data: { passwordHash } });
            await Promise.all([
                tx.passwordResetToken.updateMany({ where: { userId: record.userId, usedAt: null }, data: { usedAt: now } }),
                tx.refreshToken.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: now } }),
            ]);
            return { success: true };
        });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
        if (!user?.passwordHash || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
            throw new UnauthorizedException('Current password is incorrect');
        }
        if (await bcrypt.compare(newPassword, user.passwordHash)) {
            throw new BadRequestException('New password must be different');
        }
        const now = new Date();
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.$transaction([
            this.prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
            this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: now } }),
            this.prisma.passwordResetToken.updateMany({ where: { userId, usedAt: null }, data: { usedAt: now } }),
        ]);
        return { success: true };
    }
    async login(dto, meta) {
        const user = await this.prisma.user.findFirst({ where: { email: dto.email.toLowerCase(), deletedAt: null } });
        if (!user?.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash)))
            throw new UnauthorizedException('Incorrect email or password');
        await this.ensureAccountActive(user);
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
        await this.ensureAccountActive(record.user);
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
        const currentUser = await this.prisma.user.findUnique({ where: { id: user.id }, select: { emailVerifiedAt: true } });
        return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, roles: user.roles, avatarUrl: user.avatarUrl, emailVerifiedAt: currentUser?.emailVerifiedAt ?? null } };
    }
    async createAndSendVerification(userId, email) {
        const token = randomBytes(32).toString('hex');
        const now = new Date();
        await this.prisma.emailVerificationToken.create({
            data: {
                userId,
                tokenHash: this.hashToken(token),
                sentAt: now,
                expiresAt: new Date(now.getTime() + 30 * 60_000),
            },
        });
        await this.emailDelivery.sendVerification(email, token);
    }
    hashToken(token) {
        return createHash('sha256').update(token).digest('hex');
    }
    async ensureAccountActive(user) {
        if (user.moderationStatus === UserModerationStatus.TEMPORARILY_SUSPENDED && user.suspendedUntil && user.suspendedUntil <= new Date()) {
            await this.prisma.user.update({ where: { id: user.id }, data: { moderationStatus: UserModerationStatus.ACTIVE, suspendedUntil: null, suspensionReason: null } });
            return;
        }
        if (user.moderationStatus !== UserModerationStatus.ACTIVE)
            throw new UnauthorizedException('Account suspended');
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService,
        ConfigService,
        EmailDeliveryService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map