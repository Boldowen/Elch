var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    logger = new Logger(AllExceptionsFilter_1.name);
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
        if (status >= 500) {
            this.logger.error(JSON.stringify({
                event: 'unhandled_http_exception',
                requestId: request.requestId,
                method: request.method,
                path: request.url.split('?')[0],
                statusCode: status,
                error: exception instanceof Error ? exception.name : 'Error',
                message: exception instanceof Error ? exception.message : 'Unknown exception',
            }), exception instanceof Error ? exception.stack : undefined);
        }
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
AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    Catch()
], AllExceptionsFilter);
export { AllExceptionsFilter };
//# sourceMappingURL=all-exceptions.filter.js.map