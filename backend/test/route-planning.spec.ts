import { RoutePlanningService } from '../src/modules/route-planning/route-planning.service.js';
import { RoutePlannerService } from '../src/modules/route-planning/route-planner.service.js';

describe('RoutePlanningService', () => {
  const service = new RoutePlanningService();

  it('exposes the four research routes', () => {
    expect(service.listRoutes()).toHaveLength(4);
  });

  it('passes a feasible Central Mongolia itinerary', () => {
    const result = service.validate({
      routeId: 'central-heritage',
      startDate: '2026-07-01',
      maxDailyMinutes: 720,
      budgetMinor: 20000,
      permitConfirmed: true,
      stops: [
        { poiId: 'ulaanbaatar', day: 1, activityMinutes: 60 },
        { poiId: 'kharkhorin', day: 2, activityMinutes: 120 },
        { poiId: 'orkhon-valley', day: 3, activityMinutes: 120 },
      ],
      guide: {
        languageLevel: 'B2',
        routeBadges: ['central-heritage'],
        specialtySkills: ['heritage-interpretation'],
        firstAidVerified: true,
        legalRole: 'LICENSED_PROFESSIONAL_GUIDE',
      },
    }, new Date('2026-08-15'));
    expect(result.valid).toBe(true);
    expect(result.summary.distanceKm).toBe(480);
  });

  it('rejects seasonal, time and safety violations', () => {
    const result = service.validate({
      routeId: 'western-altai',
      startDate: '2026-01-01',
      maxDailyMinutes: 300,
      stops: [
        { poiId: 'olgii', day: 1, activityMinutes: 60 },
        { poiId: 'tsagaan-salaa', day: 1, activityMinutes: 60 },
        { poiId: 'upper-tsagaan-gol', day: 2, activityMinutes: 60 },
      ],
      guide: {
        languageLevel: 'B1',
        routeBadges: [],
        specialtySkills: [],
        firstAidVerified: false,
        legalRole: 'LOCAL_HOST',
      },
    }, new Date('2026-08-15'));
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.rule)).toEqual(expect.arrayContaining([
      'SEASON_ACCESS', 'TIME_FEASIBILITY', 'GUIDE_ELIGIBILITY', 'RISK_ESCALATION',
    ]));
  });

  it('does not let a missing guide bypass an R2 safety gate', () => {
    const result = service.validate({
      routeId: 'gobi', startDate: '2026-09-01',
      stops: [
        { poiId: 'dalanzadgad', day: 1, activityMinutes: 60 },
        { poiId: 'yolyn-am', day: 2, activityMinutes: 60 },
      ],
    }, new Date('2026-08-15'));
    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'GUIDE_REQUIRED', severity: 'ERROR' })]));
  });

  it('ignores caller-authored credentials and keeps the declared R3 risk', async () => {
    const result = await service.validateAuthoritative({
      routeId: 'western-altai',
      startDate: '2026-07-01',
      permitConfirmed: true,
      safetyPlanProvided: true,
      humanApprovalProvided: true,
      stops: [
        { poiId: 'olgii', day: 1, activityMinutes: 60 },
        { poiId: 'tsagaan-salaa', day: 2, activityMinutes: 60 },
      ],
      guide: {
        languageLevel: 'C2',
        routeBadges: ['western-altai'],
        specialtySkills: ['high-altitude-trekking'],
        firstAidVerified: true,
        legalRole: 'LICENSED_PROFESSIONAL_GUIDE',
      },
    }, new Date('2026-08-15'));

    expect(result.valid).toBe(false);
    expect(result.summary.highestRisk).toBe('R3');
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'GUIDE_REQUIRED', severity: 'ERROR' }),
      expect.objectContaining({ code: 'SAFETY_CONSTRAINT_FAILED', severity: 'ERROR' }),
    ]));
    expect(result.authoritativeForBooking).toBe(false);
  });

  it('detects incompatible transport and repairs at most once', () => {
    const planner = new RoutePlannerService(service);
    const result = planner.plan({
      routeId: 'central-heritage', startDate: '2026-07-01', days: 2,
      transportation: 'BOAT', maxDailyHours: 3,
    });
    expect(result.validation.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'TRANSPORT_INCOMPATIBLE' })]));
    expect(result.repairAttempted).toBe(true);
    expect(result.repaired).not.toHaveProperty('repaired');
  });

  it('rejects unreviewed provenance in the authoritative database-backed path', async () => {
    const fixture = new RoutePlanningService().getRoute('central-heritage') as any;
    const graph = { find: async () => fixture };
    const authoritative = new RoutePlanningService(undefined, undefined, graph as any);

    const result = await authoritative.validateAuthoritative({
      routeId: 'central-heritage',
      startDate: '2026-07-01',
      permitConfirmed: true,
      stops: [
        { poiId: 'ulaanbaatar', day: 1, activityMinutes: 60 },
        { poiId: 'kharkhorin', day: 2, activityMinutes: 120 },
        { poiId: 'orkhon-valley', day: 3, activityMinutes: 120 },
      ],
    }, new Date('2026-08-15'));

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'SOURCE_UNVERIFIED', rule: 'SOURCE_PROVENANCE', severity: 'ERROR' }),
    ]));
  });

  it('accepts explicitly reviewed source provenance in the authoritative path', async () => {
    const fixture = new RoutePlanningService().getRoute('central-heritage') as any;
    const graph = {
      find: async () => ({
        ...fixture,
        sources: fixture.sources.map((source: any) => ({
          ...source,
          verificationStatus: 'HUMAN_VERIFIED',
          licenseOrUsageNote: 'Reviewed for this controlled research use.',
        })),
      }),
    };
    const authoritative = new RoutePlanningService(undefined, undefined, graph as any);

    const result = await authoritative.validateAuthoritative({
      routeId: 'central-heritage',
      startDate: '2026-07-01',
      permitConfirmed: true,
      stops: [
        { poiId: 'ulaanbaatar', day: 1, activityMinutes: 60 },
        { poiId: 'kharkhorin', day: 2, activityMinutes: 120 },
        { poiId: 'orkhon-valley', day: 3, activityMinutes: 120 },
      ],
    }, new Date('2026-08-15'));

    expect(result.issues).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'SOURCE_UNVERIFIED' }),
    ]));
  });
});
