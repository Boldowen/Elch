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

const TOOL_NAMES = new Set<ControlledToolName>(['searchRoutes','getRouteDetails','validateRoute','searchTours','getTourDetails','searchGuides','getGuideDetails','getLiveWeather','getRoadClosures','getPermitRequirements','searchTransportAvailability','createBookingDraft']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const searchSchema = z.object({
  query: z.string().trim().min(1).max(200).nullable(),
  limit: z.number().int().min(1).max(20).nullable(),
}).strict();
const detailsSchema = z.object({ id: z.string().trim().min(1).max(100) }).strict();
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
  ) {}

  /**
   * The model sees only this fixed, typed allow-list. Every execute path calls
   * execute() again so authorization and server-side validation are enforced
   * independently of the model/provider schema validation.
   */
  aiSdkTools(context: AiToolContext) {
    return {
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
        execute: (input) => this.execute('validateRoute', input, context),
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
      case 'searchRoutes': return this.result('searchRoutes', await this.searchRoutes(params));
      case 'getRouteDetails': return this.result('getRouteDetails', await this.routes.getRoute(this.requiredString(params, 'id')));
      case 'validateRoute': return this.result('validateRoute', await this.routes.validateAuthoritative(this.validationParams(params), new Date(), context.userId));
      case 'searchTours': return this.result('searchTours', await this.searchTours(params));
      case 'getTourDetails': return this.result('getTourDetails', await this.getTour(params));
      case 'searchGuides': return this.result('searchGuides', await this.searchGuides(params));
      case 'getGuideDetails': return this.result('getGuideDetails', await this.getGuide(params));
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
        message: 'Authentication is required to create a booking draft',
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
  private validationParams(params: Record<string, unknown>) {
    const routeId = this.requiredString(params, 'routeId');
    const startDate = this.requiredString(params, 'startDate');
    if (Number.isNaN(Date.parse(startDate))) throw new BadRequestException('startDate must be an ISO date');
    if (!Array.isArray(params.stops) || params.stops.length < 2 || params.stops.length > 30) throw new BadRequestException('stops must contain between 2 and 30 items');
    const stops = params.stops.map((value) => {
      const stop = this.record(value);
      const poiId = this.requiredString(stop, 'poiId');
      const day = Number(stop.day);
      const activityMinutes = Number(stop.activityMinutes);
      if (!Number.isInteger(day) || day < 1 || day > 30) throw new BadRequestException('stop day must be an integer between 1 and 30');
      if (!Number.isInteger(activityMinutes) || activityMinutes < 0 || activityMinutes > 1440) throw new BadRequestException('activityMinutes must be an integer between 0 and 1440');
      return { poiId, day, activityMinutes };
    });
    return { routeId, startDate, stops };
  }
}
