var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserModerationStatus } from '../../generated/prisma/client.js';
let JwtStrategy = class JwtStrategy extends PassportStrategy(Strategy) {
    prisma;
    constructor(config, prisma) {
        super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false, secretOrKey: config.getOrThrow('JWT_ACCESS_SECRET') });
        this.prisma = prisma;
    }
    async validate(payload) {
        const user = await this.prisma.user.findFirst({
            where: { id: payload.sub, deletedAt: null },
            select: { moderationStatus: true, suspendedUntil: true },
        });
        if (!user)
            throw new UnauthorizedException();
        if (user.moderationStatus === UserModerationStatus.TEMPORARILY_SUSPENDED && user.suspendedUntil && user.suspendedUntil <= new Date()) {
            await this.prisma.user.update({ where: { id: payload.sub }, data: { moderationStatus: UserModerationStatus.ACTIVE, suspendedUntil: null, suspensionReason: null } });
            return payload;
        }
        if (user.moderationStatus !== UserModerationStatus.ACTIVE)
            throw new UnauthorizedException('Account suspended');
        return payload;
    }
};
JwtStrategy = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService, PrismaService])
], JwtStrategy);
export { JwtStrategy };
//# sourceMappingURL=jwt.strategy.js.map