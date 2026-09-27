import { Injectable } from '@nestjs/common';

type RouteMetric = {
  method: string;
  route: string;
  requests: number;
  errors: number;
  clientErrors: number;
  totalDurationMs: number;
  maxDurationMs: number;
  durations: number[];
  cursor: number;
};

@Injectable()
export class MetricsService {
  private readonly startedAt = new Date();
  private readonly routes = new Map<string, RouteMetric>();
  private readonly domainErrors = new Map<string, number>();
  private readonly maxRoutes = 256;
  private readonly sampleSize = 1024;

  record(method: string, route: string, statusCode: number, durationMs: number, errorCode?: string) {
    method = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/.test(method) ? method : 'OTHER';
    let safeRoute = this.normalizeRoute(route);
    let key = `${method} ${safeRoute}`;
    if (!this.routes.has(key) && this.routes.size >= this.maxRoutes) {
      method = 'OTHER';
      safeRoute = ':overflow';
      key = 'OTHER :overflow';
    }
    durationMs = Number.isFinite(durationMs) ? Math.max(0, durationMs) : 0;
    const metric = this.routes.get(key) ?? {
      method,
      route: safeRoute,
      requests: 0,
      errors: 0,
      clientErrors: 0,
      totalDurationMs: 0,
      maxDurationMs: 0,
      durations: [],
      cursor: 0,
    };
    metric.requests += 1;
    if (statusCode >= 500) metric.errors += 1;
    else if (statusCode >= 400) metric.clientErrors += 1;
    metric.totalDurationMs += durationMs;
    metric.maxDurationMs = Math.max(metric.maxDurationMs, durationMs);
    metric.durations[metric.cursor] = durationMs;
    metric.cursor = (metric.cursor + 1) % this.sampleSize;
    this.routes.set(key, metric);
    if (errorCode && /^[A-Z][A-Z0-9_]{0,79}$/.test(errorCode)) {
      const code = this.domainErrors.has(errorCode) || this.domainErrors.size < 64 ? errorCode : 'OTHER';
      this.domainErrors.set(code, (this.domainErrors.get(code) ?? 0) + 1);
    }
  }

  snapshot() {
    const routes = [...this.routes.values()]
      .map(({ durations, cursor: _cursor, ...metric }) => {
        const sorted = [...durations].sort((a, b) => a - b);
        const percentile = (fraction: number) => sorted[Math.ceil(sorted.length * fraction) - 1] ?? 0;
        return {
          ...metric,
          averageDurationMs: Number((metric.totalDurationMs / metric.requests).toFixed(2)),
          latency: { samples: sorted.length, p50: percentile(0.5), p95: percentile(0.95), p99: percentile(0.99) },
        };
      })
      .sort((left, right) => right.requests - left.requests);
    return {
      startedAt: this.startedAt.toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
      totals: {
        requests: routes.reduce((sum, route) => sum + route.requests, 0),
        serverErrors: routes.reduce((sum, route) => sum + route.errors, 0),
        clientErrors: routes.reduce((sum, route) => sum + route.clientErrors, 0),
      },
      domainErrors: Object.fromEntries(this.domainErrors),
      latencyWindow: 'Last 1024 requests per route in this process',
      routes,
    };
  }

  private normalizeRoute(value: string) {
    return value
      .split('?')[0]
      .replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, ':id')
      .replace(/\/\d+(?=\/|$)/g, '/:id')
      .slice(0, 240);
  }
}
