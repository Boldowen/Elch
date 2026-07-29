import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../../generated/prisma/client.js';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { ApplyGuideDto } from './dto/apply-guide.dto.js';
import { ReviewGuideApplicationDto } from './dto/review-guide-application.dto.js';
import { UpdateGuideProfileDto } from './dto/update-guide-profile.dto.js';
import { GuidesService } from './guides.service.js';

@ApiTags('guides')
@Controller({ path: 'guides', version: '1' })
export class GuidesController {
  constructor(private readonly guides: GuidesService) {}

  @Public()
  @Get()
  all() {
    return this.guides.findAll();
  }

  @Public()
  @Get('ranking')
  ranking() {
    return this.guides.ranking();
  }

  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: RequestUser) {
    return this.guides.findMine(user.sub);
  }

  @ApiBearerAuth()
  @Patch('me')
  updateMine(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateGuideProfileDto,
  ) {
    return this.guides.updateMine(user.sub, dto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('applications')
  applications() {
    return this.guides.listApplications();
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Patch('applications/:id/review')
  review(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: ReviewGuideApplicationDto,
  ) {
    return this.guides.reviewApplication(user.sub, id, dto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('applications/:id/reviews')
  applicationReviews(@Param('id') id: string) {
    return this.guides.applicationReviews(id);
  }

  @ApiBearerAuth()
  @Post('apply')
  apply(@CurrentUser() user: RequestUser, @Body() dto: ApplyGuideDto) {
    return this.guides.apply(user.sub, dto);
  }

  @Public()
  @Get(':id')
  one(@Param('id') id: string) {
    return this.guides.findOne(id);
  }
}
