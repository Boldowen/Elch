import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserModerationStatus } from '../../generated/prisma/client.js';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private readonly prisma: PrismaService) {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false, secretOrKey: config.getOrThrow('JWT_ACCESS_SECRET') });
  }
  async validate(payload: { sub: string; email: string; roles: string[] }) {
    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null },
      select: { moderationStatus: true, suspendedUntil: true },
    });
    if (!user) throw new UnauthorizedException();
    if (user.moderationStatus === UserModerationStatus.TEMPORARILY_SUSPENDED && user.suspendedUntil && user.suspendedUntil <= new Date()) {
      await this.prisma.user.update({ where: { id: payload.sub }, data: { moderationStatus: UserModerationStatus.ACTIVE, suspendedUntil: null, suspensionReason: null } });
      return payload;
    }
    if (user.moderationStatus !== UserModerationStatus.ACTIVE) throw new UnauthorizedException('Account suspended');
    return payload;
  }
}
