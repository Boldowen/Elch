import { Injectable } from '@nestjs/common';

type RouteMetric = {
  method: string;
  route: string;
  requests: number;
  errors: number;
  totalDurationMs: number;
  maxDurationMs: number;
};

@Injectable()
export class MetricsService {
  private readonly startedAt = new Date();
  private readonly routes = new Map<string, RouteMetric>();

  record(method: string, route: string, statusCode: number, durationMs: number) {
    const safeRoute = this.normalizeRoute(route);
    const key = `${method} ${safeRoute}`;
    const metric = this.routes.get(key) ?? {
      method,
      route: safeRoute,
      requests: 0,
      errors: 0,
      totalDurationMs: 0,
      maxDurationMs: 0,
    };
    metric.requests += 1;
    if (statusCode >= 500) metric.errors += 1;
    metric.totalDurationMs += durationMs;
    metric.maxDurationMs = Math.max(metric.maxDurationMs, durationMs);
    this.routes.set(key, metric);
  }

  snapshot() {
    const routes = [...this.routes.values()]
      .map((metric) => ({
        ...metric,
        averageDurationMs: Number((metric.totalDurationMs / metric.requests).toFixed(2)),
      }))
      .sort((left, right) => right.requests - left.requests);
    return {
      startedAt: this.startedAt.toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
      totals: {
        requests: routes.reduce((sum, route) => sum + route.requests, 0),
        serverErrors: routes.reduce((sum, route) => sum + route.errors, 0),
      },
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
