import { Body, Controller, DefaultValuePipe, Get, Param, ParseBoolPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { RequestUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/client.js';
import { GuideAssessmentsService } from './guide-assessments.service.js';
import { CreateAssessmentQuestionDto, EvaluateLanguageDto, HumanReviewDto, SaveAssessmentResponseDto, StartAssessmentDto } from './dto/guide-assessment.dto.js';
import { LanguageAssessmentService } from './language-assessment.service.js';

@ApiTags('guide-assessments')
@ApiBearerAuth()
@Controller({ path: 'guide-assessments', version: '1' })
export class GuideAssessmentsController {
  constructor(private readonly assessments: GuideAssessmentsService, private readonly language: LanguageAssessmentService) {}
  @Get('dashboard') dashboard(@CurrentUser() user: RequestUser) { return this.assessments.dashboard(user.sub); }
  @Get('attempts') history(@CurrentUser() user: RequestUser) { return this.assessments.history(user.sub); }
  @Post('attempts') start(@CurrentUser() user: RequestUser, @Body() dto: StartAssessmentDto) { return this.assessments.start(user.sub, dto); }
  @Get('attempts/:id') attempt(@CurrentUser() user: RequestUser, @Param('id') id: string) { return this.assessments.getOwned(user.sub, id); }
  @Post('attempts/:id/responses') respond(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: SaveAssessmentResponseDto) { return this.assessments.saveResponse(user.sub, id, dto); }
  @Post('attempts/:id/submit') submit(@CurrentUser() user: RequestUser, @Param('id') id: string) { return this.assessments.submit(user.sub, id); }
  @Roles(Role.ADMIN) @Get('review-queue') queue(@Query('blind', new DefaultValuePipe(true), ParseBoolPipe) blind: boolean) { return this.assessments.reviewQueue(blind); }
  @Roles(Role.ADMIN) @Post('attempts/:id/review') review(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: HumanReviewDto) { return this.assessments.review(user.sub, id, dto); }
  @Roles(Role.ADMIN) @Post('questions') createQuestion(@Body() dto: CreateAssessmentQuestionDto) { return this.assessments.createQuestion(dto); }
  @Post('attempts/:id/language-evaluate') evaluateLanguage(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: EvaluateLanguageDto) { return this.language.evaluate(user.sub, id, dto); }
}
