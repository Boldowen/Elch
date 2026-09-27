import { jest } from '@jest/globals';
import { ConfigService } from '@nestjs/config';
import {
  TourismAuthorityLevel,
  TourismKnowledgeCategory,
  TourismSourceReviewStatus,
} from '../src/generated/prisma/client.js';
import { EmbeddingService } from '../src/modules/ai/embedding.service.js';
import { TourismRetrievalService } from '../src/modules/tourism-knowledge/tourism-retrieval.service.js';

describe('tourism RAG retrieval', () => {
  it('preserves citations and favors higher-authority sources', async () => {
    const embeddings = new EmbeddingService(new ConfigService({}));
    const embedding = await embeddings.embed('Orkhon heritage');
    const base = {
      content: 'Orkhon heritage', title: 'Orkhon', region: 'Central', routeFamily: 'CENTRAL_HERITAGE',
      category: TourismKnowledgeCategory.HISTORY, language: 'en', embedding, embeddingModel: embeddings.identity(embedding.length), lastVerifiedAt: new Date(),
    };
    const prisma = { tourismKnowledge: { findMany: async () => [
      { ...base, id: 'operator', source: { id: 's1', title: 'Operator', organization: 'O', authorityLevel: TourismAuthorityLevel.VERIFIED_OPERATOR, url: 'https://example.com/o', lastVerifiedAt: new Date(), reviewStatus: TourismSourceReviewStatus.HUMAN_VERIFIED, reviewedAt: new Date(), licenseOrUsageNote: 'Attributed reuse' } },
      { ...base, id: 'legal', source: { id: 's2', title: 'Law', organization: 'Government', authorityLevel: TourismAuthorityLevel.LEGAL, url: 'https://example.com/law', lastVerifiedAt: new Date(), reviewStatus: TourismSourceReviewStatus.HUMAN_VERIFIED, reviewedAt: new Date(), licenseOrUsageNote: 'Public legal source' } },
    ] } };
    const service = new TourismRetrievalService(prisma as never, new ConfigService({ RAG_TOP_K: 6, RAG_MIN_SCORE: 0 }), embeddings);
    const results = await service.search({ query: 'Orkhon heritage', language: 'en' });
    expect(results.map((item) => item.id)).toEqual(['legal', 'operator']);
    expect(results[0].source).toMatchObject({ authorityLevel: TourismAuthorityLevel.LEGAL, url: 'https://example.com/law' });
  });

  it('falls back to lexical scoring instead of comparing incompatible vectors', async () => {
    const provider = {
      embed: jest.fn().mockResolvedValue([1, 0, 0]),
      identity: jest.fn((dimensions: number) => `compat:multilingual-e5:${dimensions}`),
    };
    const prisma = { tourismKnowledge: { findMany: jest.fn().mockResolvedValue([
      {
        id: 'legacy-local',
        title: 'Gobi permit guidance',
        content: 'Current Gobi permit guidance for protected areas',
        region: 'Gobi',
        routeFamily: 'GOBI',
        category: TourismKnowledgeCategory.SAFETY,
        language: 'en',
        embedding: [1, 0],
        embeddingModel: 'local-safe-fnv1a:2',
        lastVerifiedAt: new Date(),
        source: {
          id: 'source', title: 'Authority', organization: 'Authority',
          authorityLevel: TourismAuthorityLevel.GOVERNMENT,
          url: 'https://example.com/source', lastVerifiedAt: new Date(),
          reviewStatus: TourismSourceReviewStatus.HUMAN_VERIFIED,
          reviewedAt: new Date(),
          licenseOrUsageNote: 'Attributed reuse',
        },
      },
    ]) } };
    const service = new TourismRetrievalService(
      prisma as never,
      new ConfigService({ RAG_TOP_K: 6, RAG_MIN_SCORE: 0 }),
      provider as never,
    );

    const [result] = await service.search({ query: 'Gobi permit', language: 'en' });

    expect(result.score).toBeGreaterThan(0);
    expect(provider.embed).toHaveBeenCalledTimes(1);
    expect(prisma.tourismKnowledge.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        source: { AND: expect.arrayContaining([
          { reviewStatus: TourismSourceReviewStatus.HUMAN_VERIFIED },
          { licenseOrUsageNote: { not: '' } },
          { OR: [{ validFrom: null }, { validFrom: expect.any(Object) }] },
        ]) },
      }),
      take: 5000,
    }));
  });

});
