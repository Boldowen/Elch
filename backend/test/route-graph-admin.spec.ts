import { BadRequestException, NotFoundException } from '@nestjs/common';
import { jest } from '@jest/globals';
import {
  CefrLevel,
  GuideLegalRole,
  Role,
  RouteFamily,
  RouteNodeType,
  RouteRiskLevel,
  RouteTransportMode,
} from '../src/generated/prisma/client.js';
import { ROLES_KEY } from '../src/common/decorators/roles.decorator.js';
import { RouteGraphAdminController } from '../src/modules/route-planning/route-graph-admin.controller.js';
import { RouteGraphAdminService } from '../src/modules/route-planning/route-graph-admin.service.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

const routeId = '10000000-0000-4000-8000-000000000001';
const firstNodeId = '20000000-0000-4000-8000-000000000001';
const secondNodeId = '20000000-0000-4000-8000-000000000002';
const sourceId = '30000000-0000-4000-8000-000000000001';
const edgeId = '40000000-0000-4000-8000-000000000001';

const route = {
  id: routeId,
  code: 'admin-route',
  name: 'Admin Route',
  routeFamily: RouteFamily.WESTERN_ALTAI,
  description: 'A database-owned route for invariant checks.',
  minimumDays: 2,
  recommendedDays: 5,
  riskLevel: RouteRiskLevel.R4,
  minimumLanguageLevel: CefrLevel.C1,
  routeBadge: 'admin-route',
  firstAidRequired: true,
  requiredGuideLegalRole: GuideLegalRole.SPECIALIST_INSTRUCTOR,
  requiredSpecialtySkills: ['altitude-safety'],
  active: true,
};

const createRoute = {
  code: 'new-route',
  name: 'New Route',
  routeFamily: RouteFamily.GOBI,
  description: 'A sufficiently descriptive research route for administrators.',
  minimumDays: 2,
  recommendedDays: 4,
  riskLevel: RouteRiskLevel.R2,
  minimumLanguageLevel: CefrLevel.B2,
  routeBadge: 'new-route',
  firstAidRequired: true,
  requiredGuideLegalRole: GuideLegalRole.LICENSED_PROFESSIONAL_GUIDE,
  requiredSpecialtySkills: ['heat-safety'],
};

const createEdge = {
  fromNodeId: firstNodeId,
  toNodeId: secondNodeId,
  sourceId,
  code: 'alpha-beta',
  transportMode: RouteTransportMode.TREK,
  distanceKm: 12,
  estimatedTravelMinutes: 180,
  riskLevel: RouteRiskLevel.R3,
  openMonths: [6, 7, 8],
  requiredGuideCompetencies: ['altitude-safety'],
  requiresWeatherCheck: true,
  requiresGuide: true,
  emergencyPlanRequired: true,
  lastVerifiedAt: '2026-08-27T00:00:00.000Z',
};

function serviceWith(overrides: Record<string, unknown> = {}) {
  const prisma = {
    researchRoute: {
      findFirst: jest.fn(async () => route),
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: routeId, ...data })),
      update: jest.fn(async ({ data }: { data: Record<string, unknown> }) => ({ ...route, ...data })),
    },
    routeNode: {
      count: jest.fn(async () => 2),
      findUnique: jest.fn(async () => ({
        id: firstNodeId,
        routeId,
        nameMn: 'Альфа',
        nameEn: 'Alpha',
      })),
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => data),
      update: jest.fn(async ({ data }: { data: Record<string, unknown> }) => data),
    },
    routeEdge: {
      findFirst: jest.fn(async () => ({ riskLevel: RouteRiskLevel.R3 })),
      findUnique: jest.fn(async () => ({
        id: edgeId,
        routeId,
        fromNodeId: firstNodeId,
        toNodeId: secondNodeId,
        riskLevel: RouteRiskLevel.R3,
        route: { riskLevel: RouteRiskLevel.R4 },
      })),
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => data),
      update: jest.fn(async ({ data }: { data: Record<string, unknown> }) => data),
    },
    ...overrides,
  };
  const graph = {
    list: jest.fn(async () => []),
    find: jest.fn(async () => ({ databaseId: routeId, id: route.code })),
  };
  return {
    prisma,
    graph,
    service: new RouteGraphAdminService(
      prisma as unknown as PrismaService,
      graph as never,
    ),
  };
}

describe('RouteGraphAdminService risk invariants', () => {
  it('refuses a route whose minimum duration exceeds its recommendation', async () => {
    const { service, prisma } = serviceWith();
    await expect(service.createRoute({ ...createRoute, minimumDays: 5, recommendedDays: 4 }))
      .rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.researchRoute.create).not.toHaveBeenCalled();
  });

  it('sets an explicit active default and rehydrates the created DB graph', async () => {
    const { service, prisma, graph } = serviceWith();
    await expect(service.createRoute(createRoute)).resolves.toMatchObject({ databaseId: routeId });
    expect(prisma.researchRoute.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ code: 'new-route', active: true }),
    });
    expect(graph.find).toHaveBeenCalledWith(routeId, false);
  });

  it('cannot lower a route risk below its highest active edge risk', async () => {
    const { service, prisma } = serviceWith();
    await expect(service.updateRoute(routeId, { riskLevel: RouteRiskLevel.R2 }))
      .rejects.toThrow('Route risk cannot be below active edge risk R3');
    expect(prisma.researchRoute.update).not.toHaveBeenCalled();
  });

  it('allows a route risk reduction that still covers every active edge', async () => {
    const { service, prisma, graph } = serviceWith();
    await expect(service.updateRoute(routeId, { riskLevel: RouteRiskLevel.R3 }))
      .resolves.toMatchObject({ databaseId: routeId });
    expect(prisma.researchRoute.update).toHaveBeenCalledWith({
      where: { id: routeId },
      data: { riskLevel: RouteRiskLevel.R3 },
    });
    expect(graph.find).toHaveBeenCalledWith(routeId, false);
  });

  it('requires two different active nodes from the same route before creating an edge', async () => {
    const self = serviceWith();
    await expect(self.service.createEdge(routeId, {
      ...createEdge,
      toNodeId: firstNodeId,
    })).rejects.toThrow('Route edge nodes must be different');
    expect(self.prisma.routeEdge.create).not.toHaveBeenCalled();

    const crossRoute = serviceWith();
    crossRoute.prisma.routeNode.count.mockResolvedValueOnce(1);
    await expect(crossRoute.service.createEdge(routeId, createEdge))
      .rejects.toThrow('Both active edge nodes must belong to the route');
    expect(crossRoute.prisma.routeEdge.create).not.toHaveBeenCalled();
  });

  it('cannot create an edge whose risk exceeds its route declaration', async () => {
    const r3 = { ...route, riskLevel: RouteRiskLevel.R3 };
    const { service, prisma } = serviceWith({
      researchRoute: {
        findFirst: jest.fn(async () => r3),
        create: jest.fn(),
        update: jest.fn(),
      },
    });
    await expect(service.createEdge(routeId, { ...createEdge, riskLevel: RouteRiskLevel.R4 }))
      .rejects.toThrow('Edge risk R4 exceeds declared route maximum R3');
    expect(prisma.routeEdge.create).not.toHaveBeenCalled();
  });

  it('persists reviewed seasonality metadata and database node UUIDs on an edge', async () => {
    const { service, prisma, graph } = serviceWith();
    await service.createEdge(routeId, createEdge);
    expect(prisma.routeEdge.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        routeId,
        fromNodeId: firstNodeId,
        toNodeId: secondNodeId,
        seasonality: { openMonths: [6, 7, 8], verificationStatus: 'ADMIN_REVIEWED' },
        lastVerifiedAt: new Date('2026-08-27T00:00:00.000Z'),
        active: true,
      }),
    });
    expect(graph.find).toHaveBeenCalledWith(routeId, false);
  });

  it('revalidates final nodes and risk on edge updates', async () => {
    const r3 = { ...route, riskLevel: RouteRiskLevel.R3 };
    const { service, prisma } = serviceWith({
      routeEdge: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(async () => ({
          id: edgeId,
          routeId,
          fromNodeId: firstNodeId,
          toNodeId: secondNodeId,
          riskLevel: RouteRiskLevel.R3,
          route: { riskLevel: r3.riskLevel },
        })),
      },
    });
    await expect(service.updateEdge(edgeId, { riskLevel: RouteRiskLevel.R4 }))
      .rejects.toThrow('Edge risk R4 exceeds declared route maximum R3');
    expect(prisma.routeEdge.update).not.toHaveBeenCalled();
  });

  it('rebuilds a node display name without losing the untouched translation', async () => {
    const { service, prisma, graph } = serviceWith();
    await service.updateNode(firstNodeId, { nameMn: 'Шинэ Альфа' });
    expect(prisma.routeNode.update).toHaveBeenCalledWith({
      where: { id: firstNodeId },
      data: expect.objectContaining({ nameMn: 'Шинэ Альфа', name: 'Alpha / Шинэ Альфа' }),
    });
    expect(graph.find).toHaveBeenCalledWith(routeId, false);
  });

  it('fails closed for unknown route, node, and edge references', async () => {
    const missingRoute = serviceWith();
    missingRoute.prisma.researchRoute.findFirst.mockResolvedValueOnce(null as never);
    await expect(missingRoute.service.updateRoute('missing', {}))
      .rejects.toBeInstanceOf(NotFoundException);

    const missingNode = serviceWith();
    missingNode.prisma.routeNode.findUnique.mockResolvedValueOnce(null as never);
    await expect(missingNode.service.updateNode(firstNodeId, { active: false }))
      .rejects.toBeInstanceOf(NotFoundException);

    const missingEdge = serviceWith();
    missingEdge.prisma.routeEdge.findUnique.mockResolvedValueOnce(null as never);
    await expect(missingEdge.service.updateEdge(edgeId, { active: false }))
      .rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('RouteGraphAdminController authorization metadata', () => {
  it('protects every route-graph operation at class level with the ADMIN role', () => {
    expect(Reflect.getMetadata(ROLES_KEY, RouteGraphAdminController)).toEqual([Role.ADMIN]);
  });
});
