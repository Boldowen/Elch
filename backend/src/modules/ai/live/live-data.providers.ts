import {
  GatewayTimeoutException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import {
  LiveDataProvider,
  PermitData,
  PermitQuery,
  RoadClosureData,
  RoadClosureQuery,
  TransportData,
  TransportQuery,
  VerifiedLiveResult,
  WeatherData,
  WeatherQuery,
} from './live-data.types.js';

const nullableNumber = z.number().finite().nullable();
const httpsUrl = z.string().url().refine((value) => value.startsWith('https://'), 'Expected an HTTPS URL');
const timestamp = z.string().datetime({ offset: true });

const openMeteoSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  current: z.object({
    time: z.string(),
    temperature_2m: nullableNumber.optional(),
    apparent_temperature: nullableNumber.optional(),
    precipitation: nullableNumber.optional(),
    weather_code: nullableNumber.optional(),
    wind_speed_10m: nullableNumber.optional(),
    wind_gusts_10m: nullableNumber.optional(),
  }).optional(),
  daily: z.object({
    time: z.array(z.string()).max(32),
    temperature_2m_min: z.array(nullableNumber).max(32).optional(),
    temperature_2m_max: z.array(nullableNumber).max(32).optional(),
    precipitation_sum: z.array(nullableNumber).max(32).optional(),
    precipitation_probability_max: z.array(nullableNumber).max(32).optional(),
    weather_code: z.array(nullableNumber).max(32).optional(),
    wind_gusts_10m_max: z.array(nullableNumber).max(32).optional(),
  }).optional(),
}).passthrough();

const roadClosureResponseSchema = z.object({
  updatedAt: timestamp,
  incidents: z.array(z.object({
    id: z.string().min(1).max(200),
    routeId: z.string().min(1).max(80),
    region: z.string().min(1).max(100),
    status: z.enum(['OPEN', 'RESTRICTED', 'CLOSED', 'UNKNOWN']),
    summary: z.string().min(1).max(1000),
    startsAt: timestamp.nullable(),
    endsAt: timestamp.nullable(),
    lastVerifiedAt: timestamp,
    sourceUrl: httpsUrl,
  }).strict()).max(200),
}).strict();

const permitResponseSchema = z.object({
  routeId: z.string().min(1).max(80),
  nationality: z.string().min(1).max(80),
  travelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  required: z.boolean().nullable(),
  requirements: z.array(z.string().min(1).max(500)).max(50),
  applicationUrl: httpsUrl.nullable(),
  lastVerifiedAt: timestamp,
  sourceUrl: httpsUrl,
}).strict();

const transportResponseSchema = z.object({
  updatedAt: timestamp,
  sourceUrl: httpsUrl,
  offers: z.array(z.object({
    id: z.string().min(1).max(200),
    mode: z.enum(['FLIGHT', 'BUS', 'TRAIN', 'PRIVATE_TRANSFER']),
    operator: z.string().min(1).max(200),
    origin: z.string().min(1).max(120),
    destination: z.string().min(1).max(120),
    departsAt: timestamp,
    arrivesAt: timestamp,
    availableSeats: z.number().int().nonnegative().nullable(),
    availability: z.enum(['AVAILABLE', 'LIMITED', 'SOLD_OUT', 'UNKNOWN']),
    priceMinor: z.number().int().nonnegative().nullable(),
    currency: z.string().regex(/^[A-Z]{3}$/).nullable(),
    bookingUrl: httpsUrl.nullable(),
    lastVerifiedAt: timestamp,
  }).strict()).max(200),
}).strict();

@Injectable()
export class SafeLiveHttpClient {
  constructor(private readonly config: ConfigService) {}

  async get<T>(url: URL, schema: z.ZodType<T>, apiKey?: string): Promise<T> {
    this.assertAllowedUrl(url);
    const retries = this.config.get<number>('LIVE_DATA_RETRY_ATTEMPTS', 1);
    const timeoutMs = this.config.get<number>('LIVE_DATA_TIMEOUT_MS', 8_000);
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      let response: Response;
      try {
        response = await fetch(url, {
          method: 'GET',
          signal: AbortSignal.timeout(timeoutMs),
          headers: {
            accept: 'application/json',
            ...(apiKey ? { authorization: `Bearer ${apiKey}`, 'x-api-key': apiKey } : {}),
          },
        });
      } catch (error) {
        if (this.isTimeout(error)) {
          if (attempt < retries) continue;
          throw new GatewayTimeoutException('Verified live-data provider timed out');
        }
        if (attempt < retries) continue;
        throw new ServiceUnavailableException('Verified live-data provider is unavailable');
      }
      if (response.ok) {
        let body: unknown;
        try {
          body = await response.json();
        } catch {
          throw new ServiceUnavailableException('Verified live-data provider returned an invalid response');
        }
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          throw new ServiceUnavailableException('Verified live-data provider returned an invalid response');
        }
        return parsed.data;
      }
      if (attempt < retries && this.retryable(response.status)) continue;
      throw new ServiceUnavailableException('Verified live-data provider is unavailable');
    }
    throw new ServiceUnavailableException('Verified live-data provider is unavailable');
  }

  private assertAllowedUrl(url: URL) {
    const production = this.config.get<string>('NODE_ENV', 'development') === 'production';
    if (production && url.protocol !== 'https:') {
      throw new ServiceUnavailableException('Verified live-data provider configuration is invalid');
    }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
      throw new ServiceUnavailableException('Verified live-data provider configuration is invalid');
    }
  }

  private retryable(status: number) {
    return status === 408 || status === 425 || status === 429 || status >= 500;
  }

  private isTimeout(error: unknown) {
    return !!error && typeof error === 'object' && 'name' in error &&
      (error.name === 'AbortError' || error.name === 'TimeoutError');
  }
}

@Injectable()
export class DisabledLiveDataProvider implements LiveDataProvider {
  weather(): Promise<never> { return this.unavailable(); }
  roadClosures(): Promise<never> { return this.unavailable(); }
  permits(): Promise<never> { return this.unavailable(); }
  transport(): Promise<never> { return this.unavailable(); }

  private unavailable(): Promise<never> {
    return Promise.reject(new ServiceUnavailableException(
      'Verified live-data provider is not configured',
    ));
  }
}

@Injectable()
export class DeterministicMockLiveDataProvider implements LiveDataProvider {
  private readonly observedAt = '2030-07-01T00:00:00.000Z';

  async weather(query: WeatherQuery): Promise<VerifiedLiveResult<WeatherData>> {
    const dates = query.startDate ? [query.startDate] : ['2030-07-01'];
    return this.envelope('deterministic-mock-weather', 'https://example.invalid/mock-weather', {
      latitude: query.latitude,
      longitude: query.longitude,
      timezone: 'Asia/Ulaanbaatar',
      current: {
        observedAt: this.observedAt,
        temperatureC: 18,
        apparentTemperatureC: 17,
        precipitationMm: 0,
        weatherCode: 1,
        windSpeedKph: 12,
        windGustKph: 20,
      },
      daily: dates.map((date) => ({
        date,
        temperatureMinC: 8,
        temperatureMaxC: 21,
        precipitationMm: 0,
        precipitationProbabilityPercent: 10,
        weatherCode: 1,
        windGustKph: 24,
      })),
    });
  }

  async roadClosures(query: RoadClosureQuery): Promise<VerifiedLiveResult<RoadClosureData>> {
    return this.envelope('deterministic-mock-roads', 'https://example.invalid/mock-roads', {
      updatedAt: this.observedAt,
      incidents: query.routeIds.map((routeId) => ({
        id: `mock-${routeId}`,
        routeId,
        region: query.region,
        status: 'OPEN' as const,
        summary: 'Deterministic test fixture; not a real road-status claim.',
        startsAt: null,
        endsAt: null,
        lastVerifiedAt: this.observedAt,
        sourceUrl: 'https://example.invalid/mock-roads',
      })),
    });
  }

  async permits(query: PermitQuery): Promise<VerifiedLiveResult<PermitData>> {
    return this.envelope('deterministic-mock-permits', 'https://example.invalid/mock-permits', {
      ...query,
      required: null,
      requirements: ['Deterministic test fixture; confirm with the competent authority.'],
      applicationUrl: null,
      lastVerifiedAt: this.observedAt,
    });
  }

  async transport(query: TransportQuery): Promise<VerifiedLiveResult<TransportData>> {
    return this.envelope('deterministic-mock-transport', 'https://example.invalid/mock-transport', {
      updatedAt: this.observedAt,
      offers: [{
        id: 'mock-offer-1',
        mode: query.mode === 'ANY' ? 'BUS' : query.mode,
        operator: 'Deterministic test operator',
        origin: query.origin,
        destination: query.destination,
        departsAt: `${query.departDate}T01:00:00.000Z`,
        arrivesAt: `${query.departDate}T05:00:00.000Z`,
        availableSeats: 8,
        availability: 'AVAILABLE',
        priceMinor: 50_000,
        currency: 'MNT',
        bookingUrl: null,
        lastVerifiedAt: this.observedAt,
      }],
    });
  }

  private envelope<T>(provider: string, sourceUrl: string, data: T): VerifiedLiveResult<T> {
    return {
      status: 'VERIFIED_LIVE',
      provider,
      sourceUrl,
      retrievedAt: this.observedAt,
      expiresAt: '2030-07-01T00:05:00.000Z',
      data,
    };
  }
}

@Injectable()
export class VerifiedHttpLiveDataProvider implements LiveDataProvider {
  constructor(
    private readonly config: ConfigService,
    private readonly http: SafeLiveHttpClient,
  ) {}

  async weather(query: WeatherQuery): Promise<VerifiedLiveResult<WeatherData>> {
    const base = this.config.get<string>('WEATHER_API_URL', 'https://api.open-meteo.com/v1/forecast');
    const url = this.url(base, {
      latitude: query.latitude,
      longitude: query.longitude,
      timezone: 'auto',
      current: 'temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m',
      daily: 'temperature_2m_min,temperature_2m_max,precipitation_sum,precipitation_probability_max,weather_code,wind_gusts_10m_max',
      ...(query.startDate ? { start_date: query.startDate } : { forecast_days: 7 }),
      ...(query.endDate ? { end_date: query.endDate } : {}),
    });
    const value = await this.http.get(url, openMeteoSchema);
    const result: WeatherData = {
      latitude: value.latitude,
      longitude: value.longitude,
      timezone: value.timezone,
      current: value.current ? {
        observedAt: value.current.time,
        temperatureC: value.current.temperature_2m ?? null,
        apparentTemperatureC: value.current.apparent_temperature ?? null,
        precipitationMm: value.current.precipitation ?? null,
        weatherCode: value.current.weather_code ?? null,
        windSpeedKph: value.current.wind_speed_10m ?? null,
        windGustKph: value.current.wind_gusts_10m ?? null,
      } : null,
      daily: (value.daily?.time ?? []).map((date, index) => ({
        date,
        temperatureMinC: value.daily?.temperature_2m_min?.[index] ?? null,
        temperatureMaxC: value.daily?.temperature_2m_max?.[index] ?? null,
        precipitationMm: value.daily?.precipitation_sum?.[index] ?? null,
        precipitationProbabilityPercent: value.daily?.precipitation_probability_max?.[index] ?? null,
        weatherCode: value.daily?.weather_code?.[index] ?? null,
        windGustKph: value.daily?.wind_gusts_10m_max?.[index] ?? null,
      })).slice(0, 16),
    };
    return this.envelope('open-meteo', 'https://open-meteo.com/', result);
  }

  async roadClosures(query: RoadClosureQuery): Promise<VerifiedLiveResult<RoadClosureData>> {
    const endpoint = this.requiredEndpoint('ROAD_CLOSURE_API_URL');
    const url = this.url(endpoint, {
      region: query.region,
      routeIds: query.routeIds.join(','),
      ...(query.startDate ? { startDate: query.startDate } : {}),
      ...(query.endDate ? { endDate: query.endDate } : {}),
    });
    const value = await this.http.get(
      url,
      roadClosureResponseSchema,
      this.config.get<string>('ROAD_CLOSURE_API_KEY', ''),
    );
    return this.envelope('configured-road-closure-api', endpoint, value);
  }

  async permits(query: PermitQuery): Promise<VerifiedLiveResult<PermitData>> {
    const endpoint = this.requiredEndpoint('PERMIT_API_URL');
    const value = await this.http.get(
      this.url(endpoint, query),
      permitResponseSchema,
      this.config.get<string>('PERMIT_API_KEY', ''),
    );
    return this.envelope('configured-permit-api', value.sourceUrl, {
      routeId: value.routeId,
      nationality: value.nationality,
      travelDate: value.travelDate,
      required: value.required,
      requirements: value.requirements,
      applicationUrl: value.applicationUrl,
      lastVerifiedAt: value.lastVerifiedAt,
    });
  }

  async transport(query: TransportQuery): Promise<VerifiedLiveResult<TransportData>> {
    const endpoint = this.requiredEndpoint('TRANSPORT_API_URL');
    const value = await this.http.get(
      this.url(endpoint, query),
      transportResponseSchema,
      this.config.get<string>('TRANSPORT_API_KEY', ''),
    );
    return this.envelope('configured-transport-api', value.sourceUrl, {
      updatedAt: value.updatedAt,
      offers: value.offers,
    });
  }

  private requiredEndpoint(key: string) {
    const value = this.config.get<string>(key, '').trim();
    if (!value) throw new ServiceUnavailableException('Verified live-data provider is not configured');
    return value;
  }

  private url(base: string, query: Record<string, unknown>) {
    let url: URL;
    try {
      url = new URL(base);
    } catch {
      throw new ServiceUnavailableException('Verified live-data provider configuration is invalid');
    }
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
    return url;
  }

  private envelope<T>(provider: string, sourceUrl: string, data: T): VerifiedLiveResult<T> {
    const now = new Date();
    const expires = new Date(now.getTime() + this.config.get<number>('LIVE_DATA_CACHE_TTL_SECONDS', 300) * 1000);
    return {
      status: 'VERIFIED_LIVE',
      provider,
      sourceUrl,
      retrievedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      data,
    };
  }
}
