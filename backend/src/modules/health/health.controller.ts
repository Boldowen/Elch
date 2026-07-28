import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
@Public() @Controller({ path: 'health', version: '1' })
export class HealthController { @Get() check() { return { status: 'ok', service: 'ventour-api', timestamp: new Date().toISOString() }; } }
