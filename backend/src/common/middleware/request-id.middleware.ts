import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const incoming = request.header('x-request-id');
    const requestId = incoming && /^[A-Za-z0-9_-]{1,80}$/.test(incoming) ? incoming : randomUUID();
    response.setHeader('x-request-id', requestId);
    (request as Request & { requestId?: string }).requestId = requestId;
    next();
  }
}
