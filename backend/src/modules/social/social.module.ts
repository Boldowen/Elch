import { Module } from '@nestjs/common';
import { SocialController } from './social.controller.js';
import { SocialService } from './social.service.js';
import { TrustSafetyModule } from '../trust-safety/trust-safety.module.js';

@Module({ imports: [TrustSafetyModule], controllers: [SocialController], providers: [SocialService] })
export class SocialModule {}
