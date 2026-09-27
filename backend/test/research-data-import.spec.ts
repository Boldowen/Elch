import { jest } from '@jest/globals';
import { importResearchData, loadResearchDataset, stableUuid } from '../prisma/import-research-data.js';
import { RoutePlannerService } from '../src/modules/route-planning/route-planner.service.js';

/** Records every write the importer makes; lookups behave like an empty database. */
function fakePrisma() {
  const calls: Record<string, Array<Record<string, any>>> = {};
  const record = (name: string) => jest.fn(async (args: Record<string, any>) => {
    (calls[name] ??= []).push(args);
    return { id: stableUuid(name, JSON.stringify(args.where ?? args.data ?? {})), count: 0 };
  });
  return {
    calls,
    client: {
      tourismSource: { upsert: record('tourismSource.upsert') },
      researchRoute: { upsert: record('researchRoute.upsert') },
      routeNode: { upsert: record('routeNode.upsert'), updateMany: record('routeNode.updateMany') },
      routeEdge: {
        findUnique: jest.fn(async () => null),
        update: record('routeEdge.update'),
        updateMany: record('routeEdge.updateMany'),
        upsert: record('routeEdge.upsert'),
      },
    },
  };
}

describe('research data import', () => {
  const dataset = loadResearchDataset();

  it('derives deterministic, well-formed UUIDs', () => {
    const id = stableUuid('source', 'unesco-orkhon');
    expect(id).toBe(stableUuid('source', 'unesco-orkhon'));
    expect(id).not.toBe(stableUuid('source', 'unesco-altai'));
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('creates sources as PENDING and never overwrites a recorded review decision', async () => {
    const { client, calls } = fakePrisma();
    await importResearchData(client as never, dataset);
    const sources = calls['tourismSource.upsert'];
    expect(sources).toHaveLength(dataset.sources.length);
    for (const call of sources) {
      expect(call.create).toMatchObject({ reviewStatus: 'PENDING', lastVerifiedAt: new Date(0) });
      expect(call.update).not.toHaveProperty('reviewStatus');
      expect(call.update).not.toHaveProperty('reviewedAt');
      expect(call.update).not.toHaveProperty('lastVerifiedAt');
    }
  });

  it('flags core-sequence nodes in order and gates permits only on protected or explicitly flagged edges', async () => {
    const { client, calls } = fakePrisma();
    const summary = await importResearchData(client as never, dataset);
    expect(summary.routes).toBe(dataset.routes.length);

    const gobi = dataset.routes.find((route) => route.id === 'gobi')!;
    const gobiRouteId = stableUuid('researchRoute.upsert', JSON.stringify({ code: 'gobi' }));
    const gobiNodes = calls['routeNode.upsert'].filter((call) => call.where.routeId_code.routeId === gobiRouteId);
    const core = gobiNodes
      .filter((call) => call.create.accessMetadata.coreSequence)
      .sort((left, right) => left.create.sequenceHint - right.create.sequenceHint)
      .map((call) => call.create.code);
    expect(core).toEqual(gobi.coreSequence);

    const protectedPois = new Set(dataset.pois.filter((poi) => (poi as { protectedArea?: unknown }).protectedArea).map((poi) => poi.id));
    const edgesById = new Map(dataset.edges.map((edge) => [edge.id, edge]));
    for (const call of calls['routeEdge.upsert']) {
      const edge = edgesById.get(call.create.code)!;
      const expected = Boolean(edge.requiresPermitCheck || protectedPois.has(edge.from) || protectedPois.has(edge.to));
      expect({ edge: edge.id, permit: call.create.requiresPermitCheck }).toEqual({ edge: edge.id, permit: expected });
    }
    const ubKharkhorin = calls['routeEdge.upsert'].find((call) => call.create.code === 'ub-kharkhorin')!;
    expect(ubKharkhorin.create).toMatchObject({ requiresPermitCheck: false, transportMode: 'ROAD', lastVerifiedAt: new Date(0) });
  });
});

describe('route planner with imported core sequences', () => {
  it('plans only the core sequence, not optional extension nodes', async () => {
    const route = {
      id: 'gobi', databaseId: 'db-gobi', name: 'Gobi', description: '', routeFamily: 'GOBI', active: true,
      recommendedDays: { min: 3, max: 5 }, riskClass: 'R2', disclaimer: 'draft',
      poiIds: ['dalanzadgad', 'yolyn-am', 'khongoryn-els', 'dalanzadgad-airport', 'khermen-tsav'],
      coreSequence: ['dalanzadgad', 'yolyn-am', 'khongoryn-els'],
      guideRequirements: { minimumLanguageLevel: 'B2', routeBadge: 'gobi', firstAidRequired: true, legalRole: 'LICENSED_PROFESSIONAL_GUIDE', specialtySkills: [] },
      pois: [], edges: [], sources: [],
    };
    const validation = { valid: true, feasibility: { status: 'FEASIBLE' }, issues: [] };
    const validator = { validateAuthoritative: jest.fn(async () => validation) };
    const planner = new RoutePlannerService(validator as never, { find: jest.fn(async () => route) } as never);

    const result = await planner.planAuthoritative({ routeId: 'gobi', days: 3, startDate: '2027-07-10' } as never);

    expect(result.candidate.days.map((day) => day.poiId)).toEqual(route.coreSequence);
  });
});
