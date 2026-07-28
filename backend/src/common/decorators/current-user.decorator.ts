import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export type RequestUser = { sub: string; email: string; roles: string[] };
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): RequestUser => ctx.switchToHttp().getRequest().user);
