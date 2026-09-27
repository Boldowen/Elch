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

  it('declares a mode-locked request unsolvable instead of repairing it', () => {
    const planner = new RoutePlannerService(service);
    const result = planner.plan({
      routeId: 'central-heritage', startDate: '2026-07-01', days: 2,
      transportation: 'BOAT', maxDailyHours: 3,
    });
    expect(result.validation.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'TRANSPORT_INCOMPATIBLE' })]));
    // No boat connection exists on this route, so no schedule change can help.
    expect(result.feasibility.status).toBe('UNSOLVABLE');
    expect(result.feasibility.reasons).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'TRANSPORT_UNAVAILABLE', rule: 'UNSOLVABLE' }),
    ]));
    expect(result.repairAttempted).toBe(false);
    expect(result.repaired).toBeNull();
  });

  it('repairs a daily-time overrun once without extending the requested trip', () => {
    const planner = new RoutePlannerService(service);
    const result = planner.plan({
      routeId: 'gobi', startDate: '2026-07-01', days: 3, maxDailyHours: 6.5,
    });
    expect(result.validation.valid).toBe(false);
    expect(result.validation.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'DAILY_TIME_EXCEEDED', rule: 'TIME_FEASIBILITY' }),
    ]));
    expect(result.repairAttempted).toBe(true);
    // Exactly one round: the repaired plan is not itself repaired again.
    expect(result.repaired).not.toHaveProperty('repaired');
    expect(result.repaired!.validation.summary.days).toBeLessThanOrEqual(3);
    expect(result.repaired!.validation.issues).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'TRIP_LENGTH_EXCEEDED' }),
    ]));
    const minutes = result.repaired!.candidate.days.map((day: { activityMinutes: number }) => day.activityMinutes);
    expect(Math.min(...minutes)).toBeGreaterThanOrEqual(45);
    expect(minutes.reduce((total: number, value: number) => total + value, 0)).toBeLessThan(4 * 120);
  });

  it('flags an itinerary that cannot fit in the requested number of days', () => {
    const result = service.validate({
      routeId: 'central-heritage',
      startDate: '2026-07-01',
      maxDailyMinutes: 240,
      maxDays: 1,
      permitConfirmed: true,
      stops: [
        { poiId: 'ulaanbaatar', day: 1, activityMinutes: 120 },
        { poiId: 'kharkhorin', day: 2, activityMinutes: 120 },
      ],
    }, new Date('2026-08-15'));
    expect(result.valid).toBe(false);
    expect(result.feasibility.status).toBe('UNSOLVABLE');
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'TRIP_LENGTH_EXCEEDED', rule: 'TIME_FEASIBILITY' }),
      expect.objectContaining({ code: 'TIME_BUDGET_EXCEEDED', rule: 'UNSOLVABLE' }),
    ]));
  });

  it('separates a guide gate from an impossible request', () => {
    const result = service.validate({
      routeId: 'gobi', startDate: '2026-09-01', permitConfirmed: true,
      stops: [
        { poiId: 'dalanzadgad', day: 1, activityMinutes: 60 },
        { poiId: 'yolyn-am', day: 2, activityMinutes: 60 },
      ],
    }, new Date('2026-08-15'));
    // A missing eligible guide is a gate an operator can still satisfy.
    expect(result.feasibility.status).toBe('REQUIRES_EXTERNAL_APPROVAL');
    expect(result.feasibility.unsolvable).toBe(false);
  });

  it('ranks an extension route that is absent from the fixture keyword map', async () => {
    const extension = {
      id: 'uvs-nuur', name: 'Uvs Nuur Basin', description: 'Protected wetland and steppe ecology study route.',
      recommendedDays: { min: 3, max: 7 }, riskClass: 'R2', poiIds: ['uvs-a', 'uvs-b'],
      routeFamily: 'KHUVSGUL', guideRequirements: { minimumLanguageLevel: 'B2', routeBadge: 'uvs-nuur', firstAidRequired: true, legalRole: 'LICENSED_PROFESSIONAL_GUIDE', specialtySkills: ['wildlife-observation'] },
      pois: [], edges: [], sources: [], disclaimer: 'demo', active: true, databaseId: 'uvs',
    };
    const graph = { list: async () => [extension], find: async () => extension } as never;
    const validator = { validateAuthoritative: async () => ({ valid: true, issues: [], feasibility: { status: 'FEASIBLE' } }) } as never;
    const planner = new RoutePlannerService(validator, graph);
    const result = await planner.planAuthoritative({ days: 5, startDate: '2026-07-01', interests: ['ecology'] } as never);
    expect(result.candidate.routeId).toBe('uvs-nuur');
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
