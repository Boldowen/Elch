var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const raw = exception instanceof HttpException ? exception.getResponse() : null;
        const payload = typeof raw === 'object' && raw !== null ? raw : null;
        const nested = payload?.message && typeof payload.message === 'object' ? payload.message : null;
        const message = typeof raw === 'string' ? raw : nested?.message ?? payload?.message ?? 'Internal server error';
        const code = nested?.code ?? payload?.code;
        response.status(status).json({
            statusCode: status,
            message,
            ...(code ? { code } : {}),
            error: exception instanceof Error ? exception.name : 'Error',
            path: request.url,
            requestId: request.requestId,
            timestamp: new Date().toISOString(),
        });
    }
};
AllExceptionsFilter = __decorate([
    Catch()
], AllExceptionsFilter);
export { AllExceptionsFilter };
//# sourceMappingURL=all-exceptions.filter.js.map