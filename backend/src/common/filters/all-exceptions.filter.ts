import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const raw = exception instanceof HttpException ? exception.getResponse() : null;
    const payload = typeof raw === 'object' && raw !== null ? raw as { message?: unknown; code?: string; error?: string } : null;
    const nested = payload?.message && typeof payload.message === 'object' ? payload.message as { message?: unknown; code?: string } : null;
    const message = typeof raw === 'string' ? raw : nested?.message ?? payload?.message ?? 'Internal server error';
    const rawCode = nested?.code ?? payload?.code;
    const code = typeof rawCode === 'string' && /^[A-Z][A-Z0-9_]{0,79}$/.test(rawCode) ? rawCode : undefined;
    response.locals.domainErrorCode = code;
    if (status >= 500) {
      this.logger.error(JSON.stringify({
        event: 'unhandled_http_exception',
        requestId: (request as Request & { requestId?: string }).requestId,
        method: request.method,
        route: request.route?.path ?? ':unmatched',
        statusCode: status,
        error: exception instanceof Error ? exception.name : 'Error',
      }));
    }
    response.status(status).json({
      statusCode: status,
      message,
      ...(code ? { code } : {}),
      error: exception instanceof Error ? exception.name : 'Error',
      path: request.url.split('?')[0],
      requestId: (request as Request & { requestId?: string }).requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
