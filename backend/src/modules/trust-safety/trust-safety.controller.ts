import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser, type RequestUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { ReportStatus, Role } from '../../generated/prisma/client.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { DismissReportDto, ModerateReportDto } from './dto/moderate-report.dto.js';
import { TrustSafetyService } from './trust-safety.service.js';

@ApiTags('trust-safety')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UserBlocksController {
  constructor(private readonly trust: TrustSafetyService) {}

  @Get('blocked')
  blocked(@CurrentUser() user: RequestUser) { return this.trust.listBlocked(user.sub); }

  @Post(':id/block')
  block(@CurrentUser() user: RequestUser, @Param('id') id: string) { return this.trust.block(user.sub, id); }

  @Delete(':id/block')
  unblock(@CurrentUser() user: RequestUser, @Param('id') id: string) { return this.trust.unblock(user.sub, id); }
}

@ApiTags('reports')
@ApiBearerAuth()
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly trust: TrustSafetyService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 3_600_000 } })
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateReportDto) {
    return this.trust.createReport(user.sub, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  list(@Query('status', new ParseEnumPipe(ReportStatus, { optional: true })) status?: ReportStatus) { return this.trust.listReports(status); }

  @Patch(':id/moderate')
  @Roles(Role.ADMIN)
  moderate(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: ModerateReportDto) {
    return this.trust.moderate(user.sub, id, dto);
  }

  @Patch(':id/dismiss')
  @Roles(Role.ADMIN)
  dismiss(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: DismissReportDto) {
    return this.trust.dismissReport(user.sub, id, dto.reason);
  }
}
