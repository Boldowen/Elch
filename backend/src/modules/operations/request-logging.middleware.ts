import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { MetricsService } from './metrics.service.js';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HttpRequest');

  constructor(private readonly metrics: MetricsService) {}

  use(request: Request & { requestId?: string; user?: { sub?: string } }, response: Response, next: NextFunction) {
    const startedAt = performance.now();
    let recorded = false;
    const finish = () => {
      if (recorded) return;
      recorded = true;
      const durationMs = Number((performance.now() - startedAt).toFixed(2));
      // Route templates avoid logging IDs, URL tokens, or unbounded arbitrary paths.
      const route = typeof request.route?.path === 'string' ? request.route.path : ':unmatched';
      const statusCode = response.writableFinished ? response.statusCode : 499;
      const errorCode = response.locals.domainErrorCode as string | undefined;
      this.metrics.record(request.method, route, statusCode, durationMs, errorCode);
      const event = JSON.stringify({
        event: 'http_request', requestId: request.requestId, method: request.method,
        route, statusCode, durationMs, userId: request.user?.sub,
        ...(errorCode ? { errorCode } : {}),
      });
      if (statusCode >= 500) this.logger.error(event);
      else if (statusCode >= 400) this.logger.warn(event);
      else this.logger.log(event);
    };
    response.once('finish', finish);
    response.once('close', finish);
    next();
  }
}
