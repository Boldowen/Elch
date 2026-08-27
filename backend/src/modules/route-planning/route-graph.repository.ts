import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import {
  Prisma,
  TourismAuthorityLevel,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ROUTE_GRAPH } from './route-graph.data.js';
import {
  HydratedResearchRoute,
  ResearchRoute,
  RiskClass,
  RouteEdge,
  RoutePoi,
  RouteSource,
} from './route.types.js';

export const ROUTE_RESEARCH_DISCLAIMER =
  'Research prototype only. Road, weather, price, permit and access conditions must be re-verified for the travel date.';

const routeGraphInclude = {
  source: true,
  nodes: {
    where: { active: true },
    orderBy: [{ sequenceHint: 'asc' as const }, { code: 'asc' as const }],
    include: { source: true },
  },
  edges: {
    where: { active: true },
    orderBy: { code: 'asc' as const },
    include: { source: true, fromNode: true, toNode: true },
  },
} satisfies Prisma.ResearchRouteInclude;

type DbRouteGraph = Prisma.ResearchRouteGetPayload<{ include: typeof routeGraphInclude }>;

@Injectable()
export class RouteGraphRepository {
  constructor(@Optional() private readonly prisma?: PrismaService) {}

  /** Runtime reads are database-owned. Static data is only a compatibility
   * fixture for isolated unit tests that instantiate this repository without DI. */
  async list(activeOnly = true): Promise<HydratedResearchRoute[]> {
    if (!this.prisma) return ROUTE_GRAPH.routes.map((route) => this.fromFixture(route));
    const routes = await this.prisma.researchRoute.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: [{ routeFamily: 'asc' }, { code: 'asc' }],
      include: routeGraphInclude,
    });
    return routes.map((route) => this.fromDatabase(route));
  }

  async find(reference: string, activeOnly = true): Promise<HydratedResearchRoute> {
    if (!this.prisma) {
      const fixture = ROUTE_GRAPH.routes.find((route) => route.id === reference);
      if (!fixture) throw new NotFoundException('Research route not found');
      return this.fromFixture(fixture);
    }
    const route = await this.prisma.researchRoute.findFirst({
      where: {
        ...(activeOnly ? { active: true } : {}),
        OR: this.isUuid(reference) ? [{ id: reference }, { code: reference }] : [{ code: reference }],
      },
      include: routeGraphInclude,
    });
    if (!route) throw new NotFoundException('Research route not found');
    return this.fromDatabase(route);
  }

  private fromDatabase(route: DbRouteGraph): HydratedResearchRoute {
    const activeNodeIds = new Set(route.nodes.map((node) => node.id));
    const pois: RoutePoi[] = route.nodes.map((node) => ({
      id: node.code,
      nameMn: node.nameMn,
      nameEn: node.nameEn,
      region: node.region,
      type: node.nodeType,
      latitude: Number(node.latitude),
      longitude: Number(node.longitude),
      ...(node.altitude === null ? {} : { elevationMeters: node.altitude }),
      sourceId: node.sourceId ?? route.sourceId ?? '',
    }));
    const edges: RouteEdge[] = route.edges
      .filter((edge) => activeNodeIds.has(edge.fromNodeId) && activeNodeIds.has(edge.toNodeId))
      .map((edge) => ({
        id: edge.code,
        from: edge.fromNode.code,
        to: edge.toNode.code,
        mode: edge.transportMode,
        distanceKm: Number(edge.distanceKm),
        nominalMinutes: edge.estimatedTravelMinutes,
        openMonths: this.openMonths(edge.seasonality),
        riskClass: edge.riskLevel as RiskClass,
        requiredSkills: edge.requiredGuideCompetencies,
        ...(edge.estimatedCostMinor === null ? {} : { estimatedCostMinor: edge.estimatedCostMinor }),
        sourceId: edge.sourceId,
        bidirectional: edge.bidirectional,
        requiresRoadCheck: edge.requiresRoadCheck,
        requiresWeatherCheck: edge.requiresWeatherCheck,
        requiresPermitCheck: edge.requiresPermitCheck,
        requiresGuide: edge.requiresGuide,
        emergencyPlanRequired: edge.emergencyPlanRequired,
        lastVerifiedAt: edge.lastVerifiedAt.toISOString(),
      }));
    const sourcesById = new Map<string, RouteSource>();
    for (const source of [route.source, ...route.nodes.map((node) => node.source), ...route.edges.map((edge) => edge.source)]) {
      if (!source) continue;
      sourcesById.set(source.id, {
        id: source.id,
        title: source.title,
        url: source.url,
        authority: this.authority(source.authorityLevel),
        lastVerifiedAt: source.lastVerifiedAt.toISOString(),
        verificationStatus: source.title.includes('NOT VERIFIED')
          ? 'PROTOTYPE_REQUIRES_REVIEW'
          : 'HUMAN_VERIFIED',
      });
    }
    return {
      databaseId: route.id,
      id: route.code,
      name: route.name,
      description: route.description,
      routeFamily: route.routeFamily,
      recommendedDays: { min: route.minimumDays, max: route.recommendedDays },
      poiIds: pois.map((poi) => poi.id),
      riskClass: route.riskLevel as RiskClass,
      guideRequirements: {
        minimumLanguageLevel: route.minimumLanguageLevel,
        routeBadge: route.routeBadge,
        firstAidRequired: route.firstAidRequired,
        legalRole: route.requiredGuideLegalRole,
        specialtySkills: route.requiredSpecialtySkills,
      },
      active: route.active,
      pois,
      edges,
      sources: [...sourcesById.values()],
      disclaimer: ROUTE_RESEARCH_DISCLAIMER,
      updatedAt: route.updatedAt.toISOString(),
    };
  }

  private fromFixture(route: ResearchRoute): HydratedResearchRoute {
    const poiIds = new Set(route.poiIds);
    const pois = ROUTE_GRAPH.pois.filter((poi) => poiIds.has(poi.id));
    const edges = ROUTE_GRAPH.edges.filter((edge) => poiIds.has(edge.from) && poiIds.has(edge.to));
    const sourceIds = new Set([...pois.map((poi) => poi.sourceId), ...edges.map((edge) => edge.sourceId)]);
    return {
      ...route,
      databaseId: route.id,
      routeFamily: ({
        'central-heritage': 'CENTRAL_HERITAGE',
        gobi: 'GOBI',
        khuvsgul: 'KHUVSGUL',
        'western-altai': 'WESTERN_ALTAI',
      } as Record<string, HydratedResearchRoute['routeFamily']>)[route.id] ?? 'CENTRAL_HERITAGE',
      active: true,
      pois,
      edges,
      sources: ROUTE_GRAPH.sources.filter((source) => sourceIds.has(source.id)),
      disclaimer: ROUTE_RESEARCH_DISCLAIMER,
    };
  }

  private openMonths(value: Prisma.JsonValue | null): number[] {
    if (!value || Array.isArray(value) || typeof value !== 'object') return [];
    const record = value as Record<string, Prisma.JsonValue>;
    const candidate = record.openMonths ?? record.openMonthsPrototype;
    if (!Array.isArray(candidate)) return [];
    return candidate.filter((month): month is number =>
      typeof month === 'number' && Number.isInteger(month) && month >= 1 && month <= 12,
    );
  }

  private authority(level: TourismAuthorityLevel): 1 | 2 | 3 | 4 | 5 | 6 {
    const values: Record<TourismAuthorityLevel, 1 | 2 | 3 | 4 | 5 | 6> = {
      GOVERNMENT: 1,
      LEGAL: 1,
      OFFICIAL_TOURISM: 2,
      UNESCO: 3,
      LOCAL_AUTHORITY: 4,
      MUSEUM: 4,
      PROTECTED_AREA: 4,
      VERIFIED_OPERATOR: 5,
      OTHER: 6,
    };
    return values[level];
  }

  private isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }
}
