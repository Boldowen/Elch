import { jest } from '@jest/globals';
import { CredentialLifecycleService } from '../src/modules/operations/credential-lifecycle.service.js';
import { MetricsService } from '../src/modules/operations/metrics.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('production operations', () => {
  it('normalizes high-cardinality request paths and aggregates metrics', () => {
    const metrics = new MetricsService();
    metrics.record('GET', '/api/v1/bookings/11111111-1111-4111-8111-111111111111?private=yes', 200, 10);
    metrics.record('GET', '/api/v1/bookings/22222222-2222-4222-8222-222222222222', 503, 30);
    expect(metrics.snapshot()).toMatchObject({
      totals: { requests: 2, serverErrors: 1 },
      routes: [{ route: '/api/v1/bookings/:id', requests: 2, errors: 1, averageDurationMs: 20 }],
    });
  });

  it('expires safety credentials and removes expired ephemeral records in one job', async () => {
    const result = (count: number) => Promise.resolve({ count });
    const prisma = {
      guideEvidence: { updateMany: jest.fn(() => result(1)) },
      guideRouteCompetency: { updateMany: jest.fn(() => result(2)) },
      guideCompetency: { updateMany: jest.fn(() => result(3)) },
      guideFirstAid: { updateMany: jest.fn(() => result(4)) },
      guideProfile: { updateMany: jest.fn(() => result(5)) },
      tourismKnowledge: { updateMany: jest.fn(() => result(6)) },
      idempotencyKey: { deleteMany: jest.fn(() => result(7)) },
      emailVerificationToken: { deleteMany: jest.fn(() => result(8)) },
      passwordResetToken: { deleteMany: jest.fn(() => result(9)) },
      refreshToken: { deleteMany: jest.fn(() => result(10)) },
      $transaction: jest.fn((operations: Array<Promise<{ count: number }>>) => Promise.all(operations)),
    } as unknown as PrismaService;
    const service = new CredentialLifecycleService(prisma);
    const now = new Date('2026-08-27T00:00:00.000Z');

    await expect(service.runOnce(now)).resolves.toMatchObject({
      at: now.toISOString(),
      expired: { evidence: 1, routeCompetencies: 2, competencies: 3, firstAid: 4, guideProfiles: 5, tourismKnowledge: 6 },
      deleted: { idempotencyKeys: 7, emailVerificationTokens: 8, passwordResetTokens: 9, refreshTokens: 10 },
    });
    expect(prisma.guideEvidence.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      data: { status: 'EXPIRED' },
    }));
  });
});
