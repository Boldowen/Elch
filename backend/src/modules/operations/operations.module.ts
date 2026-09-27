import { Module } from '@nestjs/common';
import { CredentialLifecycleService } from './credential-lifecycle.service.js';
import { MetricsService } from './metrics.service.js';
import { OperationsController } from './operations.controller.js';
import { RequestLoggingMiddleware } from './request-logging.middleware.js';

@Module({
  controllers: [OperationsController],
  providers: [
    MetricsService,
    CredentialLifecycleService,
    RequestLoggingMiddleware,
  ],
  exports: [MetricsService, CredentialLifecycleService, RequestLoggingMiddleware],
})
export class OperationsModule {}
