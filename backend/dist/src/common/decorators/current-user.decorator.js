import { createParamDecorator } from '@nestjs/common';
export const CurrentUser = createParamDecorator((_data, ctx) => ctx.switchToHttp().getRequest().user);
//# sourceMappingURL=current-user.decorator.js.map