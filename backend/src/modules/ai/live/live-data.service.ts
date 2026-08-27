import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  LIVE_DATA_PROVIDER,
  LiveDataProvider,
  PermitQuery,
  RoadClosureQuery,
  TransportQuery,
  WeatherQuery,
} from './live-data.types.js';

interface CacheEntry {
  expiresAt: number;
  value: unknown;
}

@Injectable()
export class LiveDataService {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly inFlight = new Map<string, Promise<unknown>>();

  constructor(
    @Inject(LIVE_DATA_PROVIDER) private readonly provider: LiveDataProvider,
    private readonly config: ConfigService,
  ) {}

  weather(query: WeatherQuery) {
    return this.cached('weather', query, () => this.provider.weather(query));
  }

  roadClosures(query: RoadClosureQuery) {
    return this.cached('road-closures', query, () => this.provider.roadClosures(query));
  }

  permits(query: PermitQuery) {
    return this.cached('permits', query, () => this.provider.permits(query));
  }

  transport(query: TransportQuery) {
    return this.cached('transport', query, () => this.provider.transport(query));
  }

  private async cached<T>(namespace: string, query: object, loader: () => Promise<T>): Promise<T> {
    const key = `${namespace}:${JSON.stringify(query)}`;
    const now = Date.now();
    const hit = this.cache.get(key);
    if (hit && hit.expiresAt > now) return hit.value as T;
    this.cache.delete(key);
    const pending = this.inFlight.get(key);
    if (pending) return pending as Promise<T>;
    const request = loader().then((value) => {
      this.prune(now);
      const ttl = this.config.get<number>('LIVE_DATA_CACHE_TTL_SECONDS', 300) * 1000;
      this.cache.set(key, { expiresAt: Date.now() + ttl, value });
      return value;
    }).finally(() => this.inFlight.delete(key));
    this.inFlight.set(key, request);
    return request;
  }

  private prune(now: number) {
    for (const [key, entry] of this.cache) {
      if (entry.expiresAt <= now) this.cache.delete(key);
    }
    const maximum = this.config.get<number>('LIVE_DATA_CACHE_MAX_ENTRIES', 500);
    while (this.cache.size >= maximum) {
      const oldest = this.cache.keys().next().value as string | undefined;
      if (!oldest) break;
      this.cache.delete(oldest);
    }
  }
}
