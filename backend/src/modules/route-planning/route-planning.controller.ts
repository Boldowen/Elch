import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { ValidateItineraryDto } from './dto/validate-itinerary.dto.js';
import { RoutePlanningService } from './route-planning.service.js';
import { PlanRouteDto } from './dto/plan-route.dto.js';
import { RoutePlannerService } from './route-planner.service.js';
import { CurrentUser, type RequestUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('route-planning')
@Controller({ path: 'research-routes', version: '1' })
export class RoutePlanningController {
  constructor(private readonly routes: RoutePlanningService, private readonly planner: RoutePlannerService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List the four research RouteGraph routes' })
  list() { return this.routes.listRoutes(); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a route with POIs, edges and source metadata' })
  one(@Param('id') id: string) { return this.routes.getRoute(id); }

  @Post('validate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deterministically validate an itinerary candidate' })
  validate(@CurrentUser() user: RequestUser, @Body() dto: ValidateItineraryDto) {
    return this.routes.validateAuthoritative(dto, new Date(), user.sub);
  }

  @Post('plan')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create, validate and at most once repair a route candidate' })
  plan(@CurrentUser() user: RequestUser, @Body() dto: PlanRouteDto) {
    return this.planner.planAuthoritative(dto, user.sub);
  }
}
