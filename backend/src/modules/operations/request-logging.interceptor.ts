import { CallHandler, ExecutionContext, HttpException, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { MetricsService } from './metrics.service.js';

type AuthenticatedRequest = Request & { requestId?: string; user?: { sub?: string } };

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HttpRequest');

  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = performance.now();
    const path = request.originalUrl?.split('?')[0] || request.url.split('?')[0];
    const finish = (statusCode: number, errorName?: string) => {
      const durationMs = Number((performance.now() - startedAt).toFixed(2));
      response.setHeader('x-response-time-ms', String(durationMs));
      this.metrics.record(request.method, path, statusCode, durationMs);
      const event = JSON.stringify({
        event: 'http_request',
        requestId: request.requestId,
        method: request.method,
        path,
        statusCode,
        durationMs,
        userId: request.user?.sub,
        ...(errorName ? { error: errorName } : {}),
      });
      if (statusCode >= 500) this.logger.error(event);
      else if (statusCode >= 400) this.logger.warn(event);
      else this.logger.log(event);
    };
    return next.handle().pipe(
      tap(() => finish(response.statusCode)),
      catchError((error: unknown) => {
        const status = error instanceof HttpException ? error.getStatus() : 500;
        finish(status, error instanceof Error ? error.name : 'Error');
        return throwError(() => error);
      }),
    );
  }
}
