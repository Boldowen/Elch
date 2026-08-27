import { Module } from '@nestjs/common';
import { RoutePlanningController } from './route-planning.controller.js';
import { RoutePlanningService } from './route-planning.service.js';
import { RoutePlannerService } from './route-planner.service.js';
import { RouteRiskPolicyService } from './route-risk-policy.service.js';
import { RouteGraphRepository } from './route-graph.repository.js';
import { RouteGraphAdminService } from './route-graph-admin.service.js';
import { RouteGraphAdminController } from './route-graph-admin.controller.js';
import { SafetyPlanController } from './safety-plan.controller.js';
import { SafetyPlanService } from './safety-plan.service.js';

@Module({
  controllers: [RouteGraphAdminController, SafetyPlanController, RoutePlanningController],
  providers: [
    RouteGraphRepository,
    RouteGraphAdminService,
    SafetyPlanService,
    RoutePlanningService,
    RoutePlannerService,
    RouteRiskPolicyService,
  ],
  exports: [
    RouteGraphRepository,
    SafetyPlanService,
    RoutePlanningService,
    RoutePlannerService,
    RouteRiskPolicyService,
  ],
})
export class RoutePlanningModule {}
