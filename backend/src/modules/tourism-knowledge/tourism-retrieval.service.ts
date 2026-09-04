import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Prisma,
  TourismAuthorityLevel,
  TourismSourceReviewStatus,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AI_PROVIDER } from '../ai/ai-provider.interface.js';
import type { AiProvider } from '../ai/ai-provider.interface.js';
import { SearchTourismKnowledgeDto } from './dto/tourism-knowledge.dto.js';

const AUTHORITY_SCORE: Record<TourismAuthorityLevel, number> = {
  LEGAL: 1, GOVERNMENT: 0.98, OFFICIAL_TOURISM: 0.94, UNESCO: 0.92,
  LOCAL_AUTHORITY: 0.86, PROTECTED_AREA: 0.84, MUSEUM: 0.82,
  VERIFIED_OPERATOR: 0.7, OTHER: 0.4,
};

@Injectable()
export class TourismRetrievalService {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService, @Inject(AI_PROVIDER) private readonly ai: AiProvider) {}

  async search(dto: SearchTourismKnowledgeDto) {
    const queryVector = await this.ai.generateEmbedding(dto.query);
    const now = new Date();
    const where: Prisma.TourismKnowledgeWhereInput = {
      active: true, region: dto.region, routeFamily: dto.routeFamily, category: dto.category, language: dto.language?.toLowerCase(),
      source: {
        AND: [
          { reviewStatus: TourismSourceReviewStatus.HUMAN_VERIFIED },
          { licenseOrUsageNote: { not: '' } },
          { OR: [{ validFrom: null }, { validFrom: { lte: now } }] },
          { OR: [{ validTo: null }, { validTo: { gt: now } }] },
        ],
      },
    };
    const minScore = this.config.get<number>('RAG_MIN_SCORE', 0.15);
    const topK = dto.topK ?? this.config.get<number>('RAG_TOP_K', 6);
    // JSON embeddings are intentionally portable for the bachelor prototype.
    // Keep the candidate pool configurable and large enough for the planned
    // 2k-5k corpus; move to pgvector/ANN before growing beyond this bound.
    const candidateLimit = Math.min(
      10_000,
      Math.max(topK, this.config.get<number>('RAG_CANDIDATE_LIMIT', 5_000)),
    );
    const candidates = await this.prisma.tourismKnowledge.findMany({
      where,
      include: { source: true },
      take: candidateLimit,
      orderBy: { lastVerifiedAt: 'desc' },
    });
    return candidates.map((item) => {
      const vector = this.vector(item.embedding);
      const semanticScore = vector?.length === queryVector.length
        ? this.cosine(queryVector, vector)
        : this.lexical(dto.query, `${item.title} ${item.content}`);
      const ageDays = Math.max(0, (Date.now() - item.lastVerifiedAt.getTime()) / 86_400_000);
      const freshnessScore = Math.max(0, 1 - ageDays / 730);
      const score = semanticScore * 0.72 + AUTHORITY_SCORE[item.source.authorityLevel] * 0.20 + freshnessScore * 0.08;
      return { item, score, semanticScore, freshnessScore };
    }).filter((result) => result.score >= minScore).sort((left, right) => right.score - left.score).slice(0, topK).map(({ item, score }) => ({
      id: item.id, title: item.title, content: item.content, region: item.region, routeFamily: item.routeFamily,
      category: item.category, language: item.language, score: Math.round(score * 10000) / 10000,
      source: {
        id: item.source.id,
        title: item.source.title,
        organization: item.source.organization,
        authorityLevel: item.source.authorityLevel,
        url: item.source.url,
        lastVerifiedAt: item.source.lastVerifiedAt,
        reviewStatus: item.source.reviewStatus,
        reviewedAt: item.source.reviewedAt,
        licenseOrUsageNote: item.source.licenseOrUsageNote,
      },
    }));
  }

  private vector(value: Prisma.JsonValue): number[] | null { return Array.isArray(value) && value.every((item) => typeof item === 'number') ? value as number[] : null; }
  private cosine(a: number[], b: number[]) { if (a.length !== b.length) return 0; let dot = 0; let aa = 0; let bb = 0; for (let index = 0; index < a.length; index += 1) { dot += a[index] * b[index]; aa += a[index] ** 2; bb += b[index] ** 2; } return dot / ((Math.sqrt(aa) * Math.sqrt(bb)) || 1); }
  private lexical(query: string, content: string) { const terms = new Set(query.toLowerCase().split(/\W+/).filter((term) => term.length > 2)); if (!terms.size) return 0; const value = content.toLowerCase(); return [...terms].filter((term) => value.includes(term)).length / terms.size; }
}
