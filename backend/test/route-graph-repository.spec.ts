import { NotFoundException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { RouteGraphRepository } from '../src/modules/route-planning/route-graph.repository.js';

describe('RouteGraphRepository', () => {
  const source = {
    id: '10000000-0000-4000-8000-000000000001',
    title: 'Human-reviewed route source',
    organization: 'Test authority',
    sourceType: 'WEBSITE',
    authorityLevel: 'LOCAL_AUTHORITY',
    url: 'https://example.com/route',
    language: 'en',
    publishedAt: null,
    validFrom: null,
    validTo: null,
    lastVerifiedAt: new Date('2026-08-01T00:00:00.000Z'),
    createdAt: new Date('2026-08-01T00:00:00.000Z'),
    updatedAt: new Date('2026-08-01T00:00:00.000Z'),
  };
  const firstNode = {
    id: '20000000-0000-4000-8000-000000000001',
    routeId: '30000000-0000-4000-8000-000000000001',
    sourceId: source.id,
    destinationId: null,
    code: 'alpha',
    name: 'Alpha',
    nameMn: 'Альфа',
    nameEn: 'Alpha',
    region: 'Test',
    latitude: 47.9,
    longitude: 106.9,
    altitude: null,
    nodeType: 'CITY',
    sequenceHint: 1,
    minimumVisitMinutes: 30,
    seasonalityMetadata: null,
    accessMetadata: null,
    safetyMetadata: null,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    source,
  };
  const secondNode = {
    ...firstNode,
    id: '20000000-0000-4000-8000-000000000002',
    code: 'beta',
    name: 'Beta',
    nameMn: 'Бета',
    nameEn: 'Beta',
    sequenceHint: 2,
  };
  const databaseRoute = {
    id: firstNode.routeId,
    sourceId: source.id,
    code: 'database-route',
    name: 'Database Route',
    routeFamily: 'WESTERN_ALTAI',
    description: 'A route whose content is owned by the database.',
    minimumDays: 2,
    recommendedDays: 4,
    riskLevel: 'R4',
    minimumLanguageLevel: 'C1',
    routeBadge: 'database-route',
    firstAidRequired: true,
    requiredGuideLegalRole: 'SPECIALIST_INSTRUCTOR',
    requiredSpecialtySkills: ['altitude-safety'],
    active: true,
    createdAt: new Date('2026-08-01T00:00:00.000Z'),
    updatedAt: new Date('2026-08-02T00:00:00.000Z'),
    source,
    nodes: [firstNode, secondNode],
    edges: [{
      id: '40000000-0000-4000-8000-000000000001',
      routeId: firstNode.routeId,
      fromNodeId: firstNode.id,
      toNodeId: secondNode.id,
      sourceId: source.id,
      code: 'alpha-beta',
      transportMode: 'TREK',
      distanceKm: 12.5,
      estimatedTravelMinutes: 240,
      estimatedCostMinor: 5000,
      estimatedCostCurrency: 'MNT',
      terrain: 'mountain',
      riskLevel: 'R3',
      seasonality: { openMonths: [6, 7, 8] },
      bidirectional: true,
      requiresRoadCheck: false,
      requiresWeatherCheck: true,
      requiresPermitCheck: true,
      requiresGuide: true,
      requiredGuideCompetencies: ['altitude-safety'],
      emergencyPlanRequired: true,
      active: true,
      lastVerifiedAt: new Date('2026-08-01T00:00:00.000Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
      source,
      fromNode: firstNode,
      toNode: secondNode,
    }],
  };

  it('hydrates routes, graph gates, and guide requirements exclusively from Prisma results', async () => {
    const prisma = {
      researchRoute: {
        findMany: jest.fn().mockResolvedValue([databaseRoute]),
        findFirst: jest.fn().mockResolvedValue(databaseRoute),
      },
    };
    const repository = new RouteGraphRepository(prisma as never);

    await expect(repository.list()).resolves.toEqual([
      expect.objectContaining({
        id: 'database-route',
        databaseId: databaseRoute.id,
        riskClass: 'R4',
        recommendedDays: { min: 2, max: 4 },
        guideRequirements: expect.objectContaining({
          minimumLanguageLevel: 'C1',
          legalRole: 'SPECIALIST_INSTRUCTOR',
          specialtySkills: ['altitude-safety'],
        }),
        pois: [
          expect.objectContaining({ id: 'alpha', databaseId: firstNode.id }),
          expect.objectContaining({ id: 'beta', databaseId: secondNode.id }),
        ],
        edges: [expect.objectContaining({
          id: 'alpha-beta',
          databaseId: databaseRoute.edges[0].id,
          from: 'alpha',
          to: 'beta',
          openMonths: [6, 7, 8],
          requiresPermitCheck: true,
        })],
        sources: [expect.objectContaining({
          id: source.id,
          verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW',
        })],
      }),
    ]);
    expect((await repository.find('database-route')).name).toBe('Database Route');
  });

  it('fails closed when an active database route is missing', async () => {
    const repository = new RouteGraphRepository({
      researchRoute: { findFirst: jest.fn().mockResolvedValue(null) },
    } as never);
    await expect(repository.find('not-seeded')).rejects.toBeInstanceOf(NotFoundException);
  });
});
