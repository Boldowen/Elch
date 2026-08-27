import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/client.js';
import {
  CreateResearchRouteDto,
  CreateRouteEdgeDto,
  CreateRouteNodeDto,
  UpdateResearchRouteDto,
  UpdateRouteEdgeDto,
  UpdateRouteNodeDto,
} from './dto/route-graph-admin.dto.js';
import { RouteGraphAdminService } from './route-graph-admin.service.js';

@ApiTags('admin-route-graph')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller({ path: 'admin/route-graph', version: '1' })
export class RouteGraphAdminController {
  constructor(private readonly graph: RouteGraphAdminService) {}

  @Get('routes')
  @ApiOperation({ summary: 'List active and inactive database-owned route graphs' })
  list() {
    return this.graph.list();
  }

  @Post('routes')
  @ApiOperation({ summary: 'Create a research route graph' })
  createRoute(@Body() dto: CreateResearchRouteDto) {
    return this.graph.createRoute(dto);
  }

  @Patch('routes/:id')
  @ApiOperation({ summary: 'Update or deactivate a research route' })
  updateRoute(@Param('id') id: string, @Body() dto: UpdateResearchRouteDto) {
    return this.graph.updateRoute(id, dto);
  }

  @Post('routes/:id/nodes')
  @ApiOperation({ summary: 'Add a node to a research route' })
  createNode(@Param('id') id: string, @Body() dto: CreateRouteNodeDto) {
    return this.graph.createNode(id, dto);
  }

  @Patch('nodes/:id')
  @ApiOperation({ summary: 'Update or deactivate a route node' })
  updateNode(@Param('id') id: string, @Body() dto: UpdateRouteNodeDto) {
    return this.graph.updateNode(id, dto);
  }

  @Post('routes/:id/edges')
  @ApiOperation({ summary: 'Add an edge whose risk does not exceed the route maximum' })
  createEdge(@Param('id') id: string, @Body() dto: CreateRouteEdgeDto) {
    return this.graph.createEdge(id, dto);
  }

  @Patch('edges/:id')
  @ApiOperation({ summary: 'Update or deactivate a route edge' })
  updateEdge(@Param('id') id: string, @Body() dto: UpdateRouteEdgeDto) {
    return this.graph.updateEdge(id, dto);
  }
}
