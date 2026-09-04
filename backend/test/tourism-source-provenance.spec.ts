import { ConfigService } from '@nestjs/config';
import { jest } from '@jest/globals';
import {
  TourismAuthorityLevel,
  TourismSourceReviewStatus,
  TourismSourceType,
} from '../src/generated/prisma/client.js';
import { TourismIngestionService } from '../src/modules/tourism-knowledge/tourism-ingestion.service.js';

describe('tourism source provenance', () => {
  const sourceCreate = jest.fn(async (args: unknown) => args);
  const sourceFindUnique = jest.fn(async () => null as unknown);
  const sourceUpdate = jest.fn(async (args: unknown) => args);
  const knowledgeFindUnique = jest.fn(async () => null as unknown);
  const knowledgeUpdateMany = jest.fn(async () => ({ count: 1 }));
  const prisma = {
    tourismSource: { create: sourceCreate, findUnique: sourceFindUnique },
    tourismKnowledge: { findUnique: knowledgeFindUnique, updateMany: knowledgeUpdateMany },
    $transaction: jest.fn(async (callback: (tx: unknown) => Promise<unknown>) => callback({
      tourismSource: { update: sourceUpdate },
      tourismKnowledge: { updateMany: knowledgeUpdateMany },
    })),
  };
  const ai = { generateEmbedding: jest.fn(async () => [0.1, 0.2]) };
  const service = new TourismIngestionService(
    prisma as never,
    ai as never,
    new ConfigService({ AI_PROVIDER: 'local' }),
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates sources as pending with a mandatory usage-rights note', async () => {
    await service.createSource({
      title: 'Official source',
      organization: 'Authority',
      sourceType: TourismSourceType.WEBSITE,
      authorityLevel: TourismAuthorityLevel.GOVERNMENT,
      url: 'https://example.com/source',
      language: 'en',
      licenseOrUsageNote: 'Link and attribute; text reuse reviewed separately',
      lastVerifiedAt: '2026-08-01T00:00:00.000Z',
    });

    expect(sourceCreate).toHaveBeenCalledWith({ data: expect.objectContaining({
      licenseOrUsageNote: 'Link and attribute; text reuse reviewed separately',
      reviewStatus: TourismSourceReviewStatus.PENDING,
    }) });
    expect(() => service.createSource({
      title: 'Bad source',
      organization: 'Authority',
      sourceType: TourismSourceType.WEBSITE,
      authorityLevel: TourismAuthorityLevel.OTHER,
      url: 'https://example.com/bad',
      language: 'en',
      licenseOrUsageNote: '   ',
      lastVerifiedAt: '2026-08-01T00:00:00.000Z',
    })).toThrow('licenseOrUsageNote is required');
  });

  it('records the human reviewer and activates chunks only for approval', async () => {
    sourceFindUnique.mockResolvedValueOnce({ id: 'source', validFrom: null });
    await service.reviewSource('reviewer', 'source', {
      lastVerifiedAt: '2026-08-02T00:00:00.000Z',
      reviewStatus: TourismSourceReviewStatus.HUMAN_VERIFIED,
      reviewNotes: 'Scope and reuse terms checked',
    });

    expect(sourceUpdate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        reviewStatus: TourismSourceReviewStatus.HUMAN_VERIFIED,
        reviewedById: 'reviewer',
        reviewedAt: expect.any(Date),
      }),
    }));
    expect(knowledgeUpdateMany).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ active: true }),
    }));

    sourceFindUnique.mockResolvedValueOnce({ id: 'source', validFrom: null });
    await service.reviewSource('reviewer', 'source', {
      lastVerifiedAt: '2026-08-02T00:00:00.000Z',
      reviewStatus: TourismSourceReviewStatus.REJECTED,
      reviewNotes: 'Reuse rights not established',
    });
    expect(knowledgeUpdateMany).toHaveBeenLastCalledWith(expect.objectContaining({
      data: expect.objectContaining({ active: false }),
    }));
  });

  it('does not allow a chunk from an unverified source to be activated directly', async () => {
    knowledgeFindUnique.mockResolvedValueOnce({
      source: { reviewStatus: TourismSourceReviewStatus.PENDING },
    });

    await expect(service.reviewKnowledge('reviewer', 'chunk', { active: true }))
      .rejects.toMatchObject({ status: 400 });
    expect(knowledgeUpdateMany).not.toHaveBeenCalled();
  });
});
