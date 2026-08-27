import { Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/client.js';
import { CredentialLifecycleService } from './credential-lifecycle.service.js';
import { MetricsService } from './metrics.service.js';

@ApiTags('operations')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller({ path: 'operations', version: '1' })
export class OperationsController {
  constructor(
    private readonly metrics: MetricsService,
    private readonly lifecycle: CredentialLifecycleService,
  ) {}

  @Get('metrics')
  getMetrics() {
    return this.metrics.snapshot();
  }

  @Post('jobs/expiry/run')
  runExpiry() {
    return this.lifecycle.runOnce(new Date());
  }
}
