import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { RequestUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/client.js';
import {
  CreateResearchEvaluationDto,
  ListResearchRunsDto,
  ResearchExportQueryDto,
} from './dto/research.dto.js';
import { ResearchService } from './research.service.js';

@ApiTags('research')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller({ path: 'research', version: '1' })
export class ResearchController {
  constructor(private readonly research: ResearchService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get the protected research dashboard summary' })
  summary() {
    return this.research.summary();
  }

  @Get('runs')
  @ApiOperation({ summary: 'List sanitized AI experiment runs' })
  runs(@Query() query: ListResearchRunsDto) {
    return this.research.runs(query);
  }

  @Post('runs/:id/evaluations')
  @ApiOperation({ summary: 'Attach a human evaluation to an experiment run' })
  addEvaluation(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateResearchEvaluationDto,
  ) {
    return this.research.addEvaluation(user.sub, id, dto);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export pseudonymized, field-whitelisted research data' })
  async export(
    @Query() query: ResearchExportQueryDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const exported = await this.research.exportData(query.format);
    response.setHeader('Content-Type', exported.contentType);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${exported.filename}"`,
    );
    response.setHeader('X-Research-Row-Count', String(exported.rowCount));
    response.setHeader('X-Research-Export-Truncated', String(exported.truncated));
    return exported.body;
  }
}
