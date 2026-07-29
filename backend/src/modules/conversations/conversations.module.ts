import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller.js';
import { ConversationsService } from './conversations.service.js';
import { TrustSafetyModule } from '../trust-safety/trust-safety.module.js';
@Module({ imports: [TrustSafetyModule], controllers: [ConversationsController], providers: [ConversationsService] })
export class ConversationsModule {}
