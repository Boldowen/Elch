import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CredentialLifecycleService } from './credential-lifecycle.service.js';
import { MetricsService } from './metrics.service.js';
import { OperationsController } from './operations.controller.js';
import { RequestLoggingInterceptor } from './request-logging.interceptor.js';

@Module({
  controllers: [OperationsController],
  providers: [
    MetricsService,
    CredentialLifecycleService,
    { provide: APP_INTERCEPTOR, useClass: RequestLoggingInterceptor },
  ],
  exports: [MetricsService, CredentialLifecycleService],
})
export class OperationsModule {}
