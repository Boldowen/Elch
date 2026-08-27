import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected an ISO date (YYYY-MM-DD)');
const boundedText = (max: number) => z.string().trim().min(1).max(max);

export const weatherQuerySchema = z.object({
  latitude: z.number().min(41.5).max(52.2),
  longitude: z.number().min(87.5).max(120.5),
  startDate: isoDate.nullable(),
  endDate: isoDate.nullable(),
}).strict().superRefine((value, context) => {
  if ((value.startDate === null) !== (value.endDate === null)) {
    context.addIssue({ code: 'custom', message: 'startDate and endDate must be supplied together' });
  }
  if (value.startDate && value.endDate && value.startDate > value.endDate) {
    context.addIssue({ code: 'custom', message: 'endDate must not be before startDate' });
  }
});

export const roadClosureQuerySchema = z.object({
  region: boundedText(100),
  routeIds: z.array(boundedText(80)).max(20),
  startDate: isoDate.nullable(),
  endDate: isoDate.nullable(),
}).strict().superRefine((value, context) => {
  if ((value.startDate === null) !== (value.endDate === null)) {
    context.addIssue({ code: 'custom', message: 'startDate and endDate must be supplied together' });
  }
  if (value.startDate && value.endDate && value.startDate > value.endDate) {
    context.addIssue({ code: 'custom', message: 'endDate must not be before startDate' });
  }
});

export const permitQuerySchema = z.object({
  routeId: boundedText(80),
  nationality: boundedText(80),
  travelDate: isoDate,
}).strict();

export const transportQuerySchema = z.object({
  origin: boundedText(120),
  destination: boundedText(120),
  departDate: isoDate,
  returnDate: isoDate.nullable(),
  passengers: z.number().int().min(1).max(20),
  mode: z.enum(['FLIGHT', 'BUS', 'TRAIN', 'PRIVATE_TRANSFER', 'ANY']),
}).strict().superRefine((value, context) => {
  if (value.returnDate && value.returnDate < value.departDate) {
    context.addIssue({ code: 'custom', message: 'returnDate must not be before departDate' });
  }
});

export type WeatherQuery = z.infer<typeof weatherQuerySchema>;
export type RoadClosureQuery = z.infer<typeof roadClosureQuerySchema>;
export type PermitQuery = z.infer<typeof permitQuerySchema>;
export type TransportQuery = z.infer<typeof transportQuerySchema>;

export interface VerifiedLiveResult<T> {
  status: 'VERIFIED_LIVE';
  provider: string;
  sourceUrl: string;
  retrievedAt: string;
  expiresAt: string;
  data: T;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: null | {
    observedAt: string;
    temperatureC: number | null;
    apparentTemperatureC: number | null;
    precipitationMm: number | null;
    weatherCode: number | null;
    windSpeedKph: number | null;
    windGustKph: number | null;
  };
  daily: Array<{
    date: string;
    temperatureMinC: number | null;
    temperatureMaxC: number | null;
    precipitationMm: number | null;
    precipitationProbabilityPercent: number | null;
    weatherCode: number | null;
    windGustKph: number | null;
  }>;
}

export interface RoadClosureData {
  updatedAt: string;
  incidents: Array<{
    id: string;
    routeId: string;
    region: string;
    status: 'OPEN' | 'RESTRICTED' | 'CLOSED' | 'UNKNOWN';
    summary: string;
    startsAt: string | null;
    endsAt: string | null;
    lastVerifiedAt: string;
    sourceUrl: string;
  }>;
}

export interface PermitData {
  routeId: string;
  nationality: string;
  travelDate: string;
  required: boolean | null;
  requirements: string[];
  applicationUrl: string | null;
  lastVerifiedAt: string;
}

export interface TransportData {
  updatedAt: string;
  offers: Array<{
    id: string;
    mode: 'FLIGHT' | 'BUS' | 'TRAIN' | 'PRIVATE_TRANSFER';
    operator: string;
    origin: string;
    destination: string;
    departsAt: string;
    arrivesAt: string;
    availableSeats: number | null;
    availability: 'AVAILABLE' | 'LIMITED' | 'SOLD_OUT' | 'UNKNOWN';
    priceMinor: number | null;
    currency: string | null;
    bookingUrl: string | null;
    lastVerifiedAt: string;
  }>;
}

export interface LiveDataProvider {
  weather(query: WeatherQuery): Promise<VerifiedLiveResult<WeatherData>>;
  roadClosures(query: RoadClosureQuery): Promise<VerifiedLiveResult<RoadClosureData>>;
  permits(query: PermitQuery): Promise<VerifiedLiveResult<PermitData>>;
  transport(query: TransportQuery): Promise<VerifiedLiveResult<TransportData>>;
}

export const LIVE_DATA_PROVIDER = Symbol('LIVE_DATA_PROVIDER');
