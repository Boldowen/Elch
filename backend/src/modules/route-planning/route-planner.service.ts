import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PlanRouteDto } from './dto/plan-route.dto.js';
import { ValidateItineraryDto } from './dto/validate-itinerary.dto.js';
import { ROUTE_GRAPH } from './route-graph.data.js';
import { RoutePlanningService } from './route-planning.service.js';
import { RouteGraphRepository } from './route-graph.repository.js';
import { HydratedResearchRoute, ResearchRoute } from './route.types.js';

type Stop = { poiId: string; day: number; activityMinutes: number };

const DEFAULT_ACTIVITY_MINUTES = 120;
/** A repair may shorten a visit but never below a usable stop. */
const MINIMUM_ACTIVITY_MINUTES = 45;

type RepairableValidation = {
  valid: boolean;
  feasibility: { status: string };
  issues: Array<{ code: string; context?: Record<string, unknown> }>;
};

type RepairOutcome<T> = { stops: Stop[]; validation: T };

/** Interest terms that describe each research route family from the plan's four
 * core cases. Keyed by route family rather than route code so extension routes
 * (plan section 6.5) reuse a family's vocabulary, and any route still ranks
 * through its own name, description, badge and specialty text. */
const FAMILY_INTEREST_TERMS: Record<string, string[]> = {
  CENTRAL_HERITAGE: ['history', 'culture', 'heritage', 'archaeology', 'museum', 'buddhism', 'түүх', 'соёл', 'өв', 'археологи'],
  GOBI: ['nature', 'geology', 'desert', 'paleontology', 'dinosaur', 'fossil', 'говь', 'цөл', 'палеонтологи'],
  KHUVSGUL: ['nature', 'lake', 'forest', 'taiga', 'water', 'ecology', 'нуур', 'ой', 'тайга'],
  WESTERN_ALTAI: ['adventure', 'trekking', 'mountain', 'archaeology', 'petroglyph', 'altitude', 'уул', 'алтай', 'хадны зураг'],
};

@Injectable()
export class RoutePlannerService {
  constructor(
    private readonly validator: RoutePlanningService,
    @Optional() private readonly graph?: RouteGraphRepository,
  ) {}

  /** Compatibility-only deterministic facade over the bundled fixture graph. */
  plan(dto: PlanRouteDto) {
    const route = this.selectFixtureRoute(dto);
    if (!route) throw new NotFoundException('No research route matches the supplied constraints');
    const stops = this.spreadStops(route.poiIds, dto.days);
    const candidate = this.candidate(route.id, stops, dto);
    const validation = this.validator.validate(candidate);
    const repaired = this.repair(candidate, validation, (next) => this.validator.validate(next));
    return {
      constraints: dto,
      candidate: this.present(route.id, stops),
      validation,
      repairAttempted: Boolean(repaired),
      repaired: repaired ? { candidate: this.present(route.id, repaired.stops), validation: repaired.validation } : null,
      feasibility: (repaired?.validation ?? validation).feasibility,
      requiredGuideProfile: route.guideRequirements,
      disclaimer: ROUTE_GRAPH.disclaimer,
    };
  }

  async planAuthoritative(dto: PlanRouteDto, actorId?: string) {
    if (!this.graph) return this.plan(dto);
    const route = await this.selectDatabaseRoute(dto);
    const stops = this.spreadStops(route.poiIds, dto.days);
    const candidate = this.candidate(route.id, stops, dto);
    const validation = await this.validator.validateAuthoritative(candidate, new Date(), actorId);
    const repaired = await this.repair(candidate, validation, (next) =>
      this.validator.validateAuthoritative(next, new Date(), actorId),
    );
    return {
      constraints: dto,
      candidate: this.presentHydrated(route, stops),
      validation,
      repairAttempted: Boolean(repaired),
      repaired: repaired ? { candidate: this.presentHydrated(route, repaired.stops), validation: repaired.validation } : null,
      feasibility: (repaired?.validation ?? validation).feasibility,
      requiredGuideProfile: route.guideRequirements,
      disclaimer: route.disclaimer,
    };
  }

  /** One controlled repair round (plan section 5.1).
   *
   * The stop set and the requested trip length are both fixed, so the only
   * lever left on a daily-time overrun is how long the traveler spends at each
   * stop. Visit time on an overloaded day is trimmed proportionally down to a
   * floor, never below it, and the result is revalidated once. A verdict of
   * `UNSOLVABLE` skips the round entirely so an impossible request is reported
   * as impossible instead of answered with a plan that cannot happen. */
  private repair<T extends RepairableValidation>(
    candidate: ValidateItineraryDto,
    validation: T,
    revalidate: (next: ValidateItineraryDto) => T,
  ): RepairOutcome<T> | null;
  private repair<T extends RepairableValidation>(
    candidate: ValidateItineraryDto,
    validation: T,
    revalidate: (next: ValidateItineraryDto) => Promise<T>,
  ): Promise<RepairOutcome<T> | null>;
  private repair(
    candidate: ValidateItineraryDto,
    validation: RepairableValidation,
    revalidate: (next: ValidateItineraryDto) => unknown,
  ): unknown {
    if (validation.valid || validation.feasibility.status !== 'REPAIRABLE') return null;
    const overloaded = new Map<number, number>();
    for (const issue of validation.issues) {
      if (issue.code !== 'DAILY_TIME_EXCEEDED' && issue.code !== 'TRAVEL_TIME_IMPOSSIBLE') continue;
      const day = Number(issue.context?.day);
      const excess = Number(issue.context?.excessMinutes);
      if (Number.isFinite(day) && Number.isFinite(excess) && excess > 0) overloaded.set(day, excess);
    }
    if (!overloaded.size) return null;

    const stops = candidate.stops.map((stop) => ({ ...stop }));
    for (const [day, excess] of overloaded) {
      const onDay = stops.filter((stop) => stop.day === day);
      const trimmable = onDay.reduce((total, stop) => total + Math.max(0, stop.activityMinutes - MINIMUM_ACTIVITY_MINUTES), 0);
      if (!trimmable) continue;
      const share = Math.min(1, excess / trimmable);
      for (const stop of onDay) {
        const headroom = Math.max(0, stop.activityMinutes - MINIMUM_ACTIVITY_MINUTES);
        stop.activityMinutes -= Math.round(headroom * share);
      }
    }
    if (stops.every((stop, index) => stop.activityMinutes === candidate.stops[index].activityMinutes)) return null;

    const result = revalidate({ ...candidate, stops });
    return result instanceof Promise
      ? result.then((resolved) => ({ stops, validation: resolved }))
      : { stops, validation: result };
  }

  private candidate(routeId: string, stops: Stop[], dto: PlanRouteDto): ValidateItineraryDto {
    return {
      routeId,
      startDate: dto.startDate,
      stops,
      maxDailyMinutes: Math.round((dto.maxDailyHours ?? 12) * 60),
      maxDays: dto.days,
      budgetMinor: dto.budgetMinor,
      transportation: dto.transportation ?? 'ANY',
    };
  }

  private spreadStops(poiIds: string[], days: number): Stop[] {
    return poiIds.map((poiId, index) => ({
      poiId,
      day: Math.min(days, Math.floor((index * days) / poiIds.length) + 1),
      activityMinutes: DEFAULT_ACTIVITY_MINUTES,
    }));
  }

  private selectFixtureRoute(dto: PlanRouteDto) {
    if (dto.routeId) return ROUTE_GRAPH.routes.find((route) => route.id === dto.routeId);
    return this.rank(ROUTE_GRAPH.routes.filter((route) => this.withinConstraints(route, dto)), dto)[0];
  }

  private async selectDatabaseRoute(dto: PlanRouteDto) {
    if (!this.graph) throw new NotFoundException('RouteGraph repository is unavailable');
    if (dto.routeId) return this.graph.find(dto.routeId);
    const routes = (await this.graph.list()).filter((route) => this.withinConstraints(route, dto));
    const selected = this.rank(routes, dto)[0];
    if (!selected) throw new NotFoundException('No research route matches the supplied constraints');
    return selected;
  }

  private withinConstraints(route: ResearchRoute, dto: PlanRouteDto) {
    const maxRisk = ({ low: 1, moderate: 2, high: 3 })[dto.riskTolerance ?? 'moderate'] ?? 2;
    return route.recommendedDays.min <= dto.days && Number(route.riskClass.slice(1)) <= maxRisk;
  }

  private rank<T extends ResearchRoute>(routes: T[], dto: PlanRouteDto): T[] {
    const terms = (dto.interests ?? []).map((item) => item.trim().toLowerCase()).filter(Boolean);
    if (!terms.length) return [...routes];
    return [...routes].sort((left, right) => this.relevance(right, terms) - this.relevance(left, terms));
  }

  /** Scores any route, including admin-created extension routes that are absent
   * from the bundled fixture graph. */
  private relevance(route: ResearchRoute, interests: string[]) {
    const family = (route as Partial<HydratedResearchRoute>).routeFamily;
    const vocabulary = new Set(family ? FAMILY_INTEREST_TERMS[family] ?? [] : []);
    const text = [
      route.name,
      route.description,
      route.guideRequirements?.routeBadge,
      ...(route.guideRequirements?.specialtySkills ?? []),
    ].filter(Boolean).join(' ').toLowerCase();
    return interests.filter((term) => vocabulary.has(term) || text.includes(term)).length;
  }

  private present(routeId: string, stops: Stop[]) {
    return { routeId, days: stops.map((stop) => ({ ...stop, destination: ROUTE_GRAPH.pois.find((poi) => poi.id === stop.poiId) })) };
  }

  private presentHydrated(route: HydratedResearchRoute, stops: Stop[]) {
    return {
      routeId: route.id,
      days: stops.map((stop) => ({ ...stop, destination: route.pois.find((poi) => poi.id === stop.poiId) })),
    };
  }
}
