import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Optional,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { tool } from 'ai';
import { z } from 'zod';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { BookingsService } from '../../bookings/bookings.service.js';
import { GuideResearchService } from '../../guide-research/guide-research.service.js';
import { RoutePlanningService } from '../../route-planning/route-planning.service.js';
import {
  validateBookingDraftToolArgs,
  ValidatedBookingDraftToolArgs,
} from './create-booking-draft-tool.dto.js';
import { AiToolContext, AiToolResult, ControlledToolName } from './tool.types.js';
import { LiveDataService } from '../live/live-data.service.js';
import {
  permitQuerySchema,
  roadClosureQuerySchema,
  transportQuerySchema,
  weatherQuerySchema,
} from '../live/live-data.types.js';

const TOOL_NAMES = new Set<ControlledToolName>([
  'searchDestinations',
  'getDestinationDetails',
  'searchRoutes',
  'getRouteDetails',
  'validateRoute',
  'searchTours',
  'getTourDetails',
  'searchGuides',
  'getGuideDetails',
  'getGuideAvailability',
  'getGuideCompetency',
  'matchGuides',
  'getTourAvailability',
  'getLiveWeather',
  'getRoadClosures',
  'getPermitRequirements',
  'searchTransportAvailability',
  'createBookingDraft',
]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const searchSchema = z.object({
  query: z.string().trim().min(1).max(200).nullable(),
  limit: z.number().int().min(1).max(20).nullable(),
}).strict();
const detailsSchema = z.object({ id: z.string().trim().min(1).max(100) }).strict();
const destinationSearchSchema = z.object({
  query: z.string().trim().min(1).max(200).nullable(),
  routeId: z.string().trim().min(1).max(80).nullable(),
  limit: z.number().int().min(1).max(20).nullable(),
}).strict();
const guideSearchSchema = z.object({
  city: z.string().trim().min(1).max(100).nullable(),
  limit: z.number().int().min(1).max(20).nullable(),
}).strict();
const itinerarySchema = z.object({
  routeId: z.string().trim().min(1).max(80),
  startDate: z.string().datetime({ offset: true }),
  stops: z.array(z.object({
    poiId: z.string().trim().min(1).max(100),
    day: z.number().int().min(1).max(30),
    activityMinutes: z.number().int().min(0).max(1440),
  }).strict()).min(2).max(30),
  maxDailyMinutes: z.number().int().min(60).max(1440).nullable(),
  budgetMinor: z.number().int().min(0).nullable(),
  transportation: z.enum(['ROAD', 'OFF_ROAD', 'TREK', 'BOAT', 'ANY']).nullable(),
  permitConfirmed: z.boolean().nullable(),
  guideProfileId: z.string().uuid().nullable(),
  guideLanguage: z.string().trim().min(2).max(32).nullable(),
  safetyPlanId: z.string().uuid().nullable(),
}).strict();
const availabilitySchema = z.object({
  id: z.string().uuid(),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
}).strict();
const tourAvailabilitySchema = availabilitySchema.extend({
  requestedUnits: z.number().int().min(1).max(20),
}).strict();
const guideCompetencySchema = z.object({
  id: z.string().uuid(),
  routeId: z.string().trim().min(1).max(80).nullable(),
  language: z.string().trim().min(2).max(32).nullable(),
}).strict();
const guideMatchSchema = z.object({
  routeId: z.string().trim().min(1).max(80),
  language: z.string().trim().min(2).max(32),
  minimumLanguageLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  requestedStartAt: z.string().datetime({ offset: true }).nullable(),
  requestedEndAt: z.string().datetime({ offset: true }).nullable(),
  limit: z.number().int().min(1).max(20).nullable(),
}).strict();
const bookingDraftSchema = z.object({
  listingId: z.string().uuid().nullable(),
  guideId: z.string().uuid().nullable(),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
  guests: z.number().int().min(1).max(30),
  note: z.string().trim().max(1000).nullable(),
  idempotencyKey: z.string().uuid(),
}).strict().superRefine((value, context) => {
  if (Boolean(value.listingId) === Boolean(value.guideId)) {
    context.addIssue({ code: 'custom', message: 'Exactly one of listingId or guideId is required' });
  }
  if (value.endsAt <= value.startsAt) {
    context.addIssue({ code: 'custom', message: 'endsAt must be after startsAt' });
  }
});

@Injectable()
export class ToolRegistryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly routes: RoutePlanningService,
    private readonly bookings: BookingsService,
    @Optional() private readonly liveData?: LiveDataService,
    @Optional() private readonly guideResearch?: GuideResearchService,
  ) {}

  /**
   * The model sees only this fixed, typed allow-list. Every execute path calls
   * execute() again so authorization and server-side validation are enforced
   * independently of the model/provider schema validation.
   */
  aiSdkTools(context: AiToolContext) {
    return {
      searchDestinations: tool({
        description: 'Search sourced destinations and route nodes. Results are catalog records, not proof of current access.',
        inputSchema: destinationSearchSchema,
        strict: true,
        execute: (input) => this.execute('searchDestinations', this.compactNullable(input), context),
      }),
      getDestinationDetails: tool({
        description: 'Read sourced destination records and the research routes containing them.',
        inputSchema: detailsSchema,
        strict: true,
        execute: (input) => this.execute('getDestinationDetails', input, context),
      }),
      searchRoutes: tool({
        description: 'Search the verified Mongolia research route catalog. This does not confirm availability.',
        inputSchema: searchSchema,
        strict: true,
        execute: (input) => this.execute('searchRoutes', this.compactNullable(input), context),
      }),
      getRouteDetails: tool({
        description: 'Read one research route and its sourced nodes, edges, guide requirements and risk class.',
        inputSchema: detailsSchema,
        strict: true,
        execute: (input) => this.execute('getRouteDetails', input, context),
      }),
      validateRoute: tool({
        description: 'Run the deterministic preflight route validator. A valid result is not a booking or safety clearance.',
        inputSchema: itinerarySchema,
        strict: true,
        execute: (input) => this.execute('validateRoute', this.compactNullable(input), context),
      }),
      searchTours: tool({
        description: 'Search currently published tour/listing records. Prices are database values, not a reservation.',
        inputSchema: searchSchema,
        strict: true,
        execute: (input) => this.execute('searchTours', this.compactNullable(input), context),
      }),
      getTourDetails: tool({
        description: 'Read the public projection of one currently published tour/listing.',
        inputSchema: detailsSchema,
        strict: true,
        execute: (input) => this.execute('getTourDetails', input, context),
      }),
      searchGuides: tool({
        description: 'Search only approved and verified public guide profiles.',
        inputSchema: guideSearchSchema,
        strict: true,
        execute: (input) => this.execute('searchGuides', this.compactNullable(input), context),
      }),
      getGuideDetails: tool({
        description: 'Read the public projection of one approved and verified guide.',
        inputSchema: detailsSchema,
        strict: true,
        execute: (input) => this.execute('getGuideDetails', input, context),
      }),
      getGuideAvailability: tool({
        description: 'Check a verified guide for overlapping application bookings in a bounded date range. The result is a snapshot, not a reservation.',
        inputSchema: availabilitySchema,
        strict: true,
        execute: (input) => this.execute('getGuideAvailability', input, context),
      }),
      getGuideCompetency: tool({
        description: 'Read only current human/document-verified guide competency evidence for an optional route and language.',
        inputSchema: guideCompetencySchema,
        strict: true,
        execute: (input) => this.execute('getGuideCompetency', this.compactNullable(input), context),
      }),
      matchGuides: tool({
        description: 'Apply database-owned hard eligibility gates before explainable ranking. Rating cannot override a failed safety gate.',
        inputSchema: guideMatchSchema,
        strict: true,
        execute: (input) => this.execute('matchGuides', this.compactNullable(input), context),
      }),
      getTourAvailability: tool({
        description: 'Check current listing inventory for a bounded date range. The snapshot does not reserve inventory or confirm a booking.',
        inputSchema: tourAvailabilitySchema,
        strict: true,
        execute: (input) => this.execute('getTourAvailability', input, context),
      }),
      getLiveWeather: tool({
        description: 'Fetch current/forecast weather for coordinates inside Mongolia from the configured verified live provider.',
        inputSchema: weatherQuerySchema,
        strict: true,
        execute: (input) => this.execute('getLiveWeather', input, context),
      }),
      getRoadClosures: tool({
        description: 'Fetch verified current road restriction/closure records. An empty result means no incidents returned, not proof a road is safe.',
        inputSchema: roadClosureQuerySchema,
        strict: true,
        execute: (input) => this.execute('getRoadClosures', input, context),
      }),
      getPermitRequirements: tool({
        description: 'Fetch current permit/access requirements for a route, nationality and date. Unknown is not permission.',
        inputSchema: permitQuerySchema,
        strict: true,
        execute: (input) => this.execute('getPermitRequirements', input, context),
      }),
      searchTransportAvailability: tool({
        description: 'Search verified live flight or ground-transport offers. Results can expire and do not reserve seats.',
        inputSchema: transportQuerySchema,
        strict: true,
        execute: (input) => this.execute('searchTransportAvailability', input, context),
      }),
      createBookingDraft: tool({
        description: 'Create an inert booking DRAFT only after the authenticated user explicitly asks for a draft and supplies complete details. Never confirms, submits, pays or reserves.',
        inputSchema: bookingDraftSchema,
        strict: true,
        execute: (input) => this.execute('createBookingDraft', this.compactNullable(input), context),
      }),
    };
  }

  async execute(name: string, args: unknown, context: AiToolContext): Promise<AiToolResult> {
    if (!TOOL_NAMES.has(name as ControlledToolName)) throw new BadRequestException('Unknown or unauthorized AI tool');
    if (name === 'createBookingDraft') this.authenticatedUserId(context);
    const params = this.record(args);
    switch (name as ControlledToolName) {
      case 'searchDestinations': return this.result('searchDestinations', await this.searchDestinations(params));
      case 'getDestinationDetails': return this.result('getDestinationDetails', await this.getDestination(params));
      case 'searchRoutes': return this.result('searchRoutes', await this.searchRoutes(params));
      case 'getRouteDetails': return this.result('getRouteDetails', await this.routes.getRoute(this.requiredString(params, 'id')));
      case 'validateRoute': return this.result('validateRoute', await this.routes.validateAuthoritative(this.validationParams(params), new Date(), context.userId));
      case 'searchTours': return this.result('searchTours', await this.searchTours(params));
      case 'getTourDetails': return this.result('getTourDetails', await this.getTour(params));
      case 'searchGuides': return this.result('searchGuides', await this.searchGuides(params));
      case 'getGuideDetails': return this.result('getGuideDetails', await this.getGuide(params));
      case 'getGuideAvailability': return this.result('getGuideAvailability', await this.getGuideAvailability(params));
      case 'getGuideCompetency': return this.result('getGuideCompetency', await this.getGuideCompetency(params));
      case 'matchGuides': return this.result('matchGuides', await this.matchGuides(params, context));
      case 'getTourAvailability': return this.result('getTourAvailability', await this.getTourAvailability(params));
      case 'getLiveWeather': return this.result('getLiveWeather', await this.live().weather(this.parse(weatherQuerySchema, params)));
      case 'getRoadClosures': return this.result('getRoadClosures', await this.live().roadClosures(this.parse(roadClosureQuerySchema, params)));
      case 'getPermitRequirements': return this.result('getPermitRequirements', await this.live().permits(this.parse(permitQuerySchema, params)));
      case 'searchTransportAvailability': return this.result('searchTransportAvailability', await this.live().transport(this.parse(transportQuerySchema, params)));
      case 'createBookingDraft': return this.result('createBookingDraft', await this.createBookingDraft(params, context));
    }
  }

  private async searchRoutes(params: Record<string, unknown>) {
    const query = this.optionalString(params, 'query')?.toLowerCase();
    const limit = this.limit(params);
    return (await this.routes.listRoutes()).filter((route) => !query || `${route.id} ${route.name} ${route.description}`.toLowerCase().includes(query)).slice(0, limit);
  }

  private async searchDestinations(params: Record<string, unknown>) {
    const parsed = this.parse(destinationSearchSchema, {
      query: params.query ?? null,
      routeId: params.routeId ?? null,
      limit: params.limit ?? null,
      ...params,
    });
    const query = parsed.query?.toLowerCase();
    const routes = (await this.routes.listRoutes())
      .filter((route) => !parsed.routeId || route.id === parsed.routeId || route.databaseId === parsed.routeId);
    const results = routes.flatMap((route) => route.pois
      .filter((poi) => !query || `${poi.id} ${poi.nameMn} ${poi.nameEn} ${poi.region}`.toLowerCase().includes(query))
      .map((poi) => {
        const source = route.sources.find((item) => item.id === poi.sourceId);
        return {
          id: poi.id,
          nameMn: poi.nameMn,
          nameEn: poi.nameEn,
          region: poi.region,
          type: poi.type,
          latitude: poi.latitude,
          longitude: poi.longitude,
          route: { id: route.id, name: route.name, riskClass: route.riskClass },
          source: source ? {
            id: source.id,
            title: source.title,
            url: source.url,
            lastVerifiedAt: source.lastVerifiedAt,
            verificationStatus: source.verificationStatus,
          } : null,
        };
      }));
    return results.slice(0, parsed.limit ?? 10);
  }

  private async getDestination(params: Record<string, unknown>) {
    const { id } = this.parse(detailsSchema, params);
    const matches = (await this.routes.listRoutes()).flatMap((route) => route.pois
      .filter((poi) => poi.id === id || poi.databaseId === id)
      .map((poi) => ({
        id: poi.id,
        nameMn: poi.nameMn,
        nameEn: poi.nameEn,
        region: poi.region,
        type: poi.type,
        latitude: poi.latitude,
        longitude: poi.longitude,
        elevationMeters: poi.elevationMeters ?? null,
        route: {
          id: route.id,
          name: route.name,
          riskClass: route.riskClass,
          recommendedDays: route.recommendedDays,
        },
        source: route.sources.find((source) => source.id === poi.sourceId) ?? null,
        disclaimer: route.disclaimer,
      })));
    if (!matches.length) throw new NotFoundException('Destination not found');
    return matches.slice(0, 20);
  }

  private async searchTours(params: Record<string, unknown>) {
    const query = this.optionalString(params, 'query');
    return this.prisma.listing.findMany({
      where: { published: true, deletedAt: null, ...(query ? { OR: [{ title: { contains: query, mode: 'insensitive' } }, { location: { contains: query, mode: 'insensitive' } }] } : {}) },
      select: { id: true, slug: true, title: true, location: true, category: true, price: true, currency: true, priceUnit: true, rating: true, reviewCount: true },
      take: this.limit(params), orderBy: { rating: 'desc' },
    });
  }

  private async getTour(params: Record<string, unknown>) {
    const item = await this.prisma.listing.findFirst({ where: { id: this.requiredString(params, 'id'), published: true, deletedAt: null }, select: { id: true, slug: true, title: true, location: true, description: true, category: true, price: true, currency: true, priceUnit: true, rating: true, reviewCount: true, amenities: true, tags: true } });
    if (!item) throw new NotFoundException('Tour/listing not found');
    return item;
  }

  private async searchGuides(params: Record<string, unknown>) {
    const city = this.optionalString(params, 'city');
    return this.prisma.guideProfile.findMany({
      where: { status: 'APPROVED', verified: true, deletedAt: null, ...(city ? { city: { contains: city, mode: 'insensitive' } } : {}) },
      select: { id: true, userId: true, city: true, country: true, bio: true, experienceYears: true, languages: true, expertise: true, pricingType: true, price: true, rating: true, reviewCount: true, legalRole: true, routeBadges: true, specialtySkills: true, user: { select: { name: true, avatarUrl: true } } },
      take: this.limit(params), orderBy: [{ rating: 'desc' }, { experienceYears: 'desc' }],
    });
  }

  private async getGuide(params: Record<string, unknown>) {
    const item = await this.prisma.guideProfile.findFirst({
      where: { id: this.requiredString(params, 'id'), status: 'APPROVED', verified: true, deletedAt: null },
      select: { id: true, userId: true, city: true, country: true, bio: true, experienceYears: true, languages: true, expertise: true, pricingType: true, price: true, rating: true, reviewCount: true, legalRole: true, routeBadges: true, specialtySkills: true, user: { select: { name: true, avatarUrl: true } } },
    });
    if (!item) throw new NotFoundException('Guide not found');
    return item;
  }

  private async getGuideAvailability(params: Record<string, unknown>) {
    const parsed = this.parse(availabilitySchema, params);
    const range = this.boundedRange(parsed.startsAt, parsed.endsAt);
    const guide = await this.prisma.guideProfile.findFirst({
      where: { id: parsed.id, status: 'APPROVED', verified: true, deletedAt: null },
      select: { id: true, userId: true },
    });
    if (!guide) throw new NotFoundException('Guide not found');
    const conflicts = await this.prisma.booking.findMany({
      where: {
        guideId: guide.userId,
        deletedAt: null,
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
        startsAt: { lt: range.endsAt },
        endsAt: { gt: range.startsAt },
      },
      select: { startsAt: true, endsAt: true, status: true },
      orderBy: { startsAt: 'asc' },
      take: 20,
    });
    return {
      guideProfileId: guide.id,
      startsAt: range.startsAt.toISOString(),
      endsAt: range.endsAt.toISOString(),
      available: conflicts.length === 0,
      conflicts,
      checkedAt: new Date().toISOString(),
      isReservation: false,
    };
  }

  private async getGuideCompetency(params: Record<string, unknown>) {
    const parsed = this.parse(guideCompetencySchema, {
      routeId: params.routeId ?? null,
      language: params.language ?? null,
      ...params,
    });
    const now = new Date();
    const route = parsed.routeId ? await this.routes.getRoute(parsed.routeId) : null;
    const verified = ['HUMAN_VERIFIED', 'DOCUMENT_VERIFIED'] as const;
    const guide = await this.prisma.guideProfile.findFirst({
      where: { id: parsed.id, status: 'APPROVED', verified: true, deletedAt: null },
      select: {
        id: true,
        legalRole: true,
        languageAssessments: {
          where: {
            ...(parsed.language ? { language: parsed.language.toLowerCase() } : {}),
            assessmentStatus: { in: [...verified] },
            humanVerifiedCefr: { not: null },
          },
          orderBy: { createdAt: 'desc' },
          select: { language: true, humanVerifiedCefr: true, assessmentStatus: true, updatedAt: true },
        },
        routeCompetencies: {
          where: {
            ...(route ? { routeFamily: route.routeFamily } : {}),
            status: { in: [...verified] },
            AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }],
          },
          orderBy: { createdAt: 'desc' },
          select: { routeFamily: true, score: true, status: true, passedAt: true, expiresAt: true },
        },
        competencies: {
          where: {
            status: { in: [...verified] },
            AND: [{ OR: [{ validTo: null }, { validTo: { gt: now } }] }],
          },
          select: { competencyType: true, competencyCode: true, score: true, status: true, validTo: true },
        },
        firstAidRecords: {
          where: {
            AND: [
              { OR: [
                { certificateStatus: 'DOCUMENT_VERIFIED' },
                { practicalVerificationStatus: 'VERIFIED' },
              ] },
              { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
            ],
          },
          select: {
            certificateStatus: true,
            practicalVerificationStatus: true,
            issuedAt: true,
            expiresAt: true,
            verifiedAt: true,
          },
        },
      },
    });
    if (!guide) throw new NotFoundException('Guide not found');
    return {
      guideProfileId: guide.id,
      legalRole: guide.legalRole,
      requestedRoute: route ? { id: route.id, routeFamily: route.routeFamily } : null,
      languages: guide.languageAssessments,
      routeCompetencies: guide.routeCompetencies,
      competencies: guide.competencies,
      firstAid: guide.firstAidRecords,
      currentVerifiedEvidenceOnly: true,
      checkedAt: now.toISOString(),
    };
  }

  private async matchGuides(params: Record<string, unknown>, context: AiToolContext) {
    const userId = this.authenticatedUserId(context);
    if (!this.guideResearch) {
      throw new ServiceUnavailableException('Guide matching service is unavailable');
    }
    const parsed = this.parse(guideMatchSchema, {
      requestedStartAt: params.requestedStartAt ?? null,
      requestedEndAt: params.requestedEndAt ?? null,
      limit: params.limit ?? null,
      ...params,
    });
    if (Boolean(parsed.requestedStartAt) !== Boolean(parsed.requestedEndAt)) {
      throw new BadRequestException('requestedStartAt and requestedEndAt must be provided together');
    }
    if (parsed.requestedStartAt && parsed.requestedEndAt) {
      this.boundedRange(parsed.requestedStartAt, parsed.requestedEndAt);
    }
    return this.guideResearch.match({
      routeId: parsed.routeId,
      language: parsed.language,
      minimumLanguageLevel: parsed.minimumLanguageLevel,
      ...(parsed.requestedStartAt ? { requestedStartAt: parsed.requestedStartAt } : {}),
      ...(parsed.requestedEndAt ? { requestedEndAt: parsed.requestedEndAt } : {}),
      ...(parsed.limit ? { limit: parsed.limit } : {}),
    }, userId);
  }

  private async getTourAvailability(params: Record<string, unknown>) {
    const parsed = this.parse(tourAvailabilitySchema, params);
    const range = this.boundedRange(parsed.startsAt, parsed.endsAt);
    const listing = await this.prisma.listing.findFirst({
      where: { id: parsed.id, status: 'PUBLISHED', published: true, deletedAt: null },
      select: { id: true, defaultTotalUnits: true },
    });
    if (!listing) throw new NotFoundException('Tour/listing not found');
    const dates = this.inventoryDates(range.startsAt, range.endsAt);
    const rows = await this.prisma.listingInventory.findMany({
      where: { listingId: listing.id, date: { in: dates } },
      select: { date: true, availableUnits: true, updatedAt: true },
      orderBy: { date: 'asc' },
    });
    const byDate = new Map(rows.map((row) => [row.date.toISOString().slice(0, 10), row]));
    const days = dates.map((date) => {
      const row = byDate.get(date.toISOString().slice(0, 10));
      return {
        date: date.toISOString().slice(0, 10),
        availableUnits: row?.availableUnits ?? listing.defaultTotalUnits,
        source: row ? 'EXPLICIT_INVENTORY' : 'DEFAULT_INVENTORY_POLICY',
        updatedAt: row?.updatedAt ?? null,
      };
    });
    const minimumAvailableUnits = Math.min(...days.map((day) => day.availableUnits));
    return {
      listingId: listing.id,
      startsAt: range.startsAt.toISOString(),
      endsAt: range.endsAt.toISOString(),
      requestedUnits: parsed.requestedUnits,
      available: minimumAvailableUnits >= parsed.requestedUnits,
      minimumAvailableUnits,
      days,
      checkedAt: new Date().toISOString(),
      isReservation: false,
    };
  }

  private async createBookingDraft(
    params: Record<string, unknown>,
    context: AiToolContext,
  ) {
    const userId = this.authenticatedUserId(context);
    const input = validateBookingDraftToolArgs(params);
    try {
      const draft = await this.bookings.createDraft(
        userId,
        input.booking,
        input.idempotencyKey,
      );
      return this.safeBookingDraft(draft, input);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException({
          code: 'BOOKING_DRAFT_INVALID',
          message: 'The booking draft could not be created from those details',
        });
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          code: 'BOOKING_DRAFT_TARGET_UNAVAILABLE',
          message: 'The selected listing or guide is not available for a draft',
        });
      }
      if (error instanceof ConflictException) {
        throw new ConflictException({
          code: 'BOOKING_DRAFT_CONFLICT',
          message: 'The booking draft conflicts with the current account or request',
        });
      }
      throw new ServiceUnavailableException({
        code: 'BOOKING_DRAFT_UNAVAILABLE',
        message: 'The booking draft could not be created',
      });
    }
  }

  private authenticatedUserId(context: AiToolContext | undefined) {
    if (!context || typeof context.userId !== 'string' || !UUID.test(context.userId)) {
      throw new UnauthorizedException({
        code: 'AI_TOOL_AUTHENTICATION_REQUIRED',
        message: 'Authentication is required for this AI tool',
      });
    }
    return context.userId;
  }

  private safeBookingDraft(
    value: unknown,
    input: ValidatedBookingDraftToolArgs,
  ) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new ServiceUnavailableException();
    }
    const draft = value as Record<string, unknown>;
    const amountMinor = Number(draft.amountMinor);
    if (
      draft.status !== 'DRAFT' ||
      typeof draft.id !== 'string' ||
      !UUID.test(draft.id) ||
      !Number.isSafeInteger(amountMinor) ||
      amountMinor < 0 ||
      typeof draft.currency !== 'string' ||
      !/^[A-Z]{3}$/.test(draft.currency)
    ) {
      throw new ServiceUnavailableException();
    }
    return {
      id: draft.id,
      status: 'DRAFT' as const,
      listingId: input.booking.listingId ?? null,
      guideId: input.booking.guideId ?? null,
      startsAt: input.booking.startsAt,
      endsAt: input.booking.endsAt,
      guests: input.booking.guests,
      amountMinor,
      currency: draft.currency,
      nextAction: 'USER_CONFIRMATION_REQUIRED' as const,
      requiresExplicitConfirmation: true,
    };
  }

  private record(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new BadRequestException('Tool parameters must be an object');
    return value as Record<string, unknown>;
  }
  private requiredString(params: Record<string, unknown>, key: string) { const value = params[key]; if (typeof value !== 'string' || !value.trim()) throw new BadRequestException(`${key} is required`); return value.trim(); }
  private optionalString(params: Record<string, unknown>, key: string) { const value = params[key]; if (value === undefined) return undefined; if (typeof value !== 'string') throw new BadRequestException(`${key} must be a string`); return value.trim(); }
  private limit(params: Record<string, unknown>) { const value = params.limit; if (value === undefined) return 10; if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > 20) throw new BadRequestException('limit must be an integer between 1 and 20'); return Number(value); }
  private result(tool: ControlledToolName, data: unknown): AiToolResult { return { tool, data, truncated: Array.isArray(data) && data.length >= 20 }; }
  private compactNullable(value: Record<string, unknown>) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== null));
  }
  private parse<T>(schema: z.ZodType<T>, value: unknown): T {
    const result = schema.safeParse(value);
    if (!result.success) throw new BadRequestException('AI tool parameters are invalid');
    return result.data;
  }
  private live() {
    if (!this.liveData) throw new ServiceUnavailableException('Verified live-data provider is unavailable');
    return this.liveData;
  }
  private boundedRange(startsAtValue: string, endsAtValue: string) {
    const startsAt = new Date(startsAtValue);
    const endsAt = new Date(endsAtValue);
    if (!Number.isFinite(startsAt.getTime()) || !Number.isFinite(endsAt.getTime()) || endsAt <= startsAt) {
      throw new BadRequestException('endsAt must be after startsAt');
    }
    if (endsAt.getTime() - startsAt.getTime() > 31 * 86_400_000) {
      throw new BadRequestException('Availability range cannot exceed 31 days');
    }
    return { startsAt, endsAt };
  }
  private inventoryDates(startsAt: Date, endsAt: Date) {
    const dates: Date[] = [];
    const cursor = new Date(Date.UTC(
      startsAt.getUTCFullYear(),
      startsAt.getUTCMonth(),
      startsAt.getUTCDate(),
    ));
    const exclusiveEnd = new Date(Date.UTC(
      endsAt.getUTCFullYear(),
      endsAt.getUTCMonth(),
      endsAt.getUTCDate(),
    ));
    do {
      dates.push(new Date(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    } while (cursor < exclusiveEnd);
    return dates;
  }
  private validationParams(params: Record<string, unknown>) {
    const parsed = this.parse(itinerarySchema, {
      maxDailyMinutes: params.maxDailyMinutes ?? null,
      budgetMinor: params.budgetMinor ?? null,
      transportation: params.transportation ?? null,
      permitConfirmed: params.permitConfirmed ?? null,
      guideProfileId: params.guideProfileId ?? null,
      guideLanguage: params.guideLanguage ?? null,
      safetyPlanId: params.safetyPlanId ?? null,
      ...params,
    });
    return {
      routeId: parsed.routeId,
      startDate: parsed.startDate,
      stops: parsed.stops,
      ...(parsed.maxDailyMinutes === null ? {} : { maxDailyMinutes: parsed.maxDailyMinutes }),
      ...(parsed.budgetMinor === null ? {} : { budgetMinor: parsed.budgetMinor }),
      ...(parsed.transportation === null ? {} : { transportation: parsed.transportation }),
      ...(parsed.permitConfirmed === null ? {} : { permitConfirmed: parsed.permitConfirmed }),
      ...(parsed.guideProfileId === null ? {} : { guideProfileId: parsed.guideProfileId }),
      ...(parsed.guideLanguage === null ? {} : { guideLanguage: parsed.guideLanguage }),
      ...(parsed.safetyPlanId === null ? {} : { safetyPlanId: parsed.safetyPlanId }),
    };
  }
}
