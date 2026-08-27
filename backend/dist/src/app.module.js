var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { configValidationSchema } from './config/config.validation.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ListingsModule } from './modules/listings/listings.module.js';
import { GuidesModule } from './modules/guides/guides.module.js';
import { BookingsModule } from './modules/bookings/bookings.module.js';
import { ConversationsModule } from './modules/conversations/conversations.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { SocialModule } from './modules/social/social.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware.js';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { TrustSafetyModule } from './modules/trust-safety/trust-safety.module.js';
import { ReviewsModule } from './modules/reviews/reviews.module.js';
import { RankingModule } from './modules/ranking/ranking.module.js';
import { RoutePlanningModule } from './modules/route-planning/route-planning.module.js';
import { GuideResearchModule } from './modules/guide-research/guide-research.module.js';
import { ResearchAssistantModule } from './modules/research-assistant/research-assistant.module.js';
import { AiModule } from './modules/ai/ai.module.js';
import { TourismKnowledgeModule } from './modules/tourism-knowledge/tourism-knowledge.module.js';
import { GuideAssessmentsModule } from './modules/guide-assessments/guide-assessments.module.js';
import { ResearchModule } from './modules/research/research.module.js';
import { OperationsModule } from './modules/operations/operations.module.js';
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(RequestIdMiddleware).forRoutes('*');
    }
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({ isGlobal: true, validationSchema: configValidationSchema }),
            ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
            ScheduleModule.forRoot(),
            PrismaModule,
            AuthModule,
            UsersModule,
            ListingsModule,
            GuidesModule,
            BookingsModule,
            ConversationsModule,
            NotificationsModule,
            TrustSafetyModule,
            ReviewsModule,
            RankingModule,
            RoutePlanningModule,
            GuideResearchModule,
            ResearchAssistantModule,
            AiModule,
            TourismKnowledgeModule,
            GuideAssessmentsModule,
            ResearchModule,
            OperationsModule,
            SocialModule,
            HealthModule,
        ],
        providers: [
            { provide: APP_GUARD, useClass: ThrottlerGuard },
            { provide: APP_GUARD, useClass: JwtAuthGuard },
            { provide: APP_GUARD, useClass: RolesGuard },
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map