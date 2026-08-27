import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { RequestUser } from '../../common/decorators/current-user.decorator.js';
import { MatchGuidesDto, ScoreCompetencyDto } from './dto/score-competency.dto.js';
import { GuideResearchService } from './guide-research.service.js';

@ApiTags('guide-research')
@Controller({ path: 'guide-research', version: '1' })
export class GuideResearchController {
  constructor(private readonly research: GuideResearchService) {}

  @Post('score')
  @ApiOperation({ summary: 'Score the 2026-aligned 100-point guide competency rubric' })
  score(@Body() dto: ScoreCompetencyDto) { return this.research.score(dto); }

  @Post('match')
  @ApiOperation({ summary: 'Apply safety hard gates, then rank eligible guides' })
  match(@CurrentUser() user: RequestUser, @Body() dto: MatchGuidesDto) { return this.research.match(dto, user.sub); }
}
