import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type RequestUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { SetGuideAvailabilityDto } from './dto/guide-availability.dto.js';
import { GuideAvailabilityService } from './guide-availability.service.js';

@ApiTags('guide availability')
@Controller({ path: 'guides', version: '1' })
export class GuideAvailabilityController {
  constructor(private readonly availability: GuideAvailabilityService) {}

  @ApiBearerAuth() @Get('me/availability')
  mine(@CurrentUser() user: RequestUser) { return this.availability.list(user.sub, true); }

  @ApiBearerAuth() @Patch('me/availability')
  replace(@CurrentUser() user: RequestUser, @Body() dto: SetGuideAvailabilityDto) { return this.availability.replace(user.sub, dto); }

  @Public() @Get(':id/availability')
  list(@Param('id') id: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.availability.list(id, false, from, to);
  }
}
