import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PlanRouteDto } from './dto/plan-route.dto.js';
import { ROUTE_GRAPH } from './route-graph.data.js';
import { RoutePlanningService } from './route-planning.service.js';
import { RouteGraphRepository } from './route-graph.repository.js';
import { HydratedResearchRoute } from './route.types.js';

@Injectable()
export class RoutePlannerService {
  constructor(
    private readonly validator: RoutePlanningService,
    @Optional() private readonly graph?: RouteGraphRepository,
  ) {}

  plan(dto: PlanRouteDto) {
    const route = this.selectRoute(dto);
    if (!route) throw new NotFoundException('No research route matches the supplied constraints');
    const stops = route.poiIds.map((poiId, index) => ({
      poiId,
      day: Math.min(dto.days, Math.floor((index * dto.days) / route.poiIds.length) + 1),
      activityMinutes: 120,
    }));
    const candidate = {
      routeId: route.id,
      startDate: dto.startDate,
      stops,
      maxDailyMinutes: Math.round((dto.maxDailyHours ?? 12) * 60),
      budgetMinor: dto.budgetMinor,
      transportation: dto.transportation ?? 'ANY' as const,
    };
    const validation = this.validator.validate(candidate);
    const repaired = validation.valid ? null : this.repairOnce(candidate, validation.issues.map((issue) => issue.code));
    return {
      constraints: dto,
      candidate: this.present(route.id, stops),
      validation,
      repairAttempted: Boolean(repaired),
      repaired,
      requiredGuideProfile: route.guideRequirements,
      disclaimer: ROUTE_GRAPH.disclaimer,
    };
  }

  async planAuthoritative(dto: PlanRouteDto, actorId?: string) {
    if (!this.graph) return this.plan(dto);
    const route = await this.selectDatabaseRoute(dto);
    const stops = route.poiIds.map((poiId, index) => ({
      poiId,
      day: Math.min(dto.days, Math.floor((index * dto.days) / route.poiIds.length) + 1),
      activityMinutes: 120,
    }));
    const candidate = {
      routeId: route.id,
      startDate: dto.startDate,
      stops,
      maxDailyMinutes: Math.round((dto.maxDailyHours ?? 12) * 60),
      budgetMinor: dto.budgetMinor,
      transportation: dto.transportation ?? 'ANY' as const,
    };
    const validation = await this.validator.validateAuthoritative(candidate, new Date(), actorId);
    const needsRepair = validation.issues.some((issue) =>
      issue.code === 'DAILY_TIME_EXCEEDED' || issue.code === 'TRAVEL_TIME_IMPOSSIBLE',
    );
    let repaired = null;
    if (needsRepair) {
      const repairedStops = candidate.stops.map((stop, index) => ({ ...stop, day: index + 1 }));
      const repairedCandidate = { ...candidate, stops: repairedStops };
      repaired = {
        candidate: this.presentHydrated(route, repairedStops),
        validation: await this.validator.validateAuthoritative(repairedCandidate, new Date(), actorId),
      };
    }
    return {
      constraints: dto,
      candidate: this.presentHydrated(route, stops),
      validation,
      repairAttempted: needsRepair,
      repaired,
      requiredGuideProfile: route.guideRequirements,
      disclaimer: route.disclaimer,
    };
  }

  private selectRoute(dto: PlanRouteDto) {
    if (dto.routeId) return ROUTE_GRAPH.routes.find((route) => route.id === dto.routeId);
    const maxRisk = ({ low: 1, moderate: 2, high: 3 })[dto.riskTolerance ?? 'moderate'];
    const feasible = ROUTE_GRAPH.routes.filter((route) => route.recommendedDays.min <= dto.days && Number(route.riskClass.slice(1)) <= maxRisk);
    const terms = new Set((dto.interests ?? []).map((item) => item.toLowerCase()));
    return feasible.sort((left, right) => this.relevance(right.id, terms) - this.relevance(left.id, terms))[0];
  }

  private relevance(routeId: string, interests: Set<string>) {
    const mapping: Record<string, string[]> = { 'central-heritage': ['history','culture','heritage','археологи','түүх'], gobi: ['nature','geology','desert','paleontology','говь'], khuvsgul: ['nature','lake','forest','water','нуур'], 'western-altai': ['adventure','trekking','mountain','archaeology','уул'] };
    return mapping[routeId].filter((term) => interests.has(term)).length;
  }

  private async selectDatabaseRoute(dto: PlanRouteDto) {
    if (!this.graph) throw new NotFoundException('RouteGraph repository is unavailable');
    if (dto.routeId) return this.graph.find(dto.routeId);
    const maxRisk = ({ low: 1, moderate: 2, high: 3 })[dto.riskTolerance ?? 'moderate'];
    const routes = (await this.graph.list()).filter((route) =>
      route.recommendedDays.min <= dto.days && Number(route.riskClass.slice(1)) <= maxRisk,
    );
    const terms = new Set((dto.interests ?? []).map((item) => item.toLowerCase()));
    const selected = routes.sort((left, right) =>
      this.relevance(right.id, terms) - this.relevance(left.id, terms),
    )[0];
    if (!selected) throw new NotFoundException('No research route matches the supplied constraints');
    return selected;
  }

  private repairOnce(candidate: Parameters<RoutePlanningService['validate']>[0], codes: string[]) {
    if (!codes.some((code) => code === 'DAILY_TIME_EXCEEDED' || code === 'TRAVEL_TIME_IMPOSSIBLE')) return null;
    const repairedStops = candidate.stops.map((stop, index) => ({ ...stop, day: index + 1 }));
    const repairedCandidate = { ...candidate, stops: repairedStops };
    return { candidate: this.present(candidate.routeId, repairedStops), validation: this.validator.validate(repairedCandidate) };
  }

  private present(routeId: string, stops: Array<{ poiId: string; day: number; activityMinutes: number }>) {
    return { routeId, days: stops.map((stop) => ({ ...stop, destination: ROUTE_GRAPH.pois.find((poi) => poi.id === stop.poiId) })) };
  }

  private presentHydrated(
    route: HydratedResearchRoute,
    stops: Array<{ poiId: string; day: number; activityMinutes: number }>,
  ) {
    return {
      routeId: route.id,
      days: stops.map((stop) => ({
        ...stop,
        destination: route.pois.find((poi) => poi.id === stop.poiId),
      })),
    };
  }
}
