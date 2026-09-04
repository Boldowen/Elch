import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type RequestUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/client.js';
import {
  CreateSafetyPlanDto,
  ReviewSafetyPlanDto,
  RevokeSafetyPlanDto,
  UpdateSafetyPlanDto,
} from './dto/safety-plan.dto.js';
import { SafetyPlanService } from './safety-plan.service.js';

@ApiTags('route-safety-plans')
@ApiBearerAuth()
@Controller({ path: 'safety-plans', version: '1' })
export class SafetyPlanController {
  constructor(private readonly safetyPlans: SafetyPlanService) {}

  @Roles(Role.TRAVELER, Role.GUIDE)
  @Post()
  @ApiOperation({ summary: 'Create an R3/R4 safety-plan draft' })
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateSafetyPlanDto) {
    return this.safetyPlans.create(user.sub, user.roles, dto);
  }

  @Roles(Role.TRAVELER, Role.GUIDE)
  @Get('mine')
  @ApiOperation({ summary: 'List safety plans created by or assigned to the current user' })
  mine(@CurrentUser() user: RequestUser) {
    return this.safetyPlans.listMine(user.sub);
  }

  @Roles(Role.ADMIN)
  @Get('admin/review-queue')
  @ApiOperation({ summary: 'List safety plans awaiting human review' })
  queue() {
    return this.safetyPlans.reviewQueue();
  }

  @Roles(Role.ADMIN)
  @Post(':id/review')
  @ApiOperation({ summary: 'Approve or reject a submitted safety plan' })
  review(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: ReviewSafetyPlanDto,
  ) {
    return this.safetyPlans.review(user.sub, id, dto);
  }

  @Roles(Role.ADMIN)
  @Post(':id/revoke')
  @ApiOperation({ summary: 'Revoke a previously approved safety plan' })
  revoke(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: RevokeSafetyPlanDto,
  ) {
    return this.safetyPlans.revoke(user.sub, id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an owned, assigned, or administratively visible safety plan' })
  get(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.safetyPlans.get(user.sub, user.roles, id);
  }

  @Roles(Role.TRAVELER, Role.GUIDE)
  @Patch(':id')
  @ApiOperation({ summary: 'Edit an owned safety-plan draft' })
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateSafetyPlanDto,
  ) {
    return this.safetyPlans.update(user.sub, id, dto);
  }

  @Roles(Role.TRAVELER, Role.GUIDE)
  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit an owned safety-plan draft for admin review' })
  submit(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.safetyPlans.submit(user.sub, id);
  }
}
