import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const raw = exception instanceof HttpException ? exception.getResponse() : null;
    const payload = typeof raw === 'object' && raw !== null ? raw as { message?: unknown; code?: string; error?: string } : null;
    const nested = payload?.message && typeof payload.message === 'object' ? payload.message as { message?: unknown; code?: string } : null;
    const message = typeof raw === 'string' ? raw : nested?.message ?? payload?.message ?? 'Internal server error';
    const code = nested?.code ?? payload?.code;
    response.status(status).json({
      statusCode: status,
      message,
      ...(code ? { code } : {}),
      error: exception instanceof Error ? exception.name : 'Error',
      path: request.url,
      requestId: (request as Request & { requestId?: string }).requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
