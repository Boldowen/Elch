import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AI_PROVIDER } from '../ai/ai-provider.interface.js';
import type { AiProvider } from '../ai/ai-provider.interface.js';
import {
  CreateTourismSourceDto,
  IngestTourismKnowledgeDto,
  ListTourismSourcesDto,
  ReviewTourismKnowledgeDto,
  ReviewTourismSourceDto,
} from './dto/tourism-knowledge.dto.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TourismIngestionService {
  private readonly logger = new Logger(TourismIngestionService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_PROVIDER) private readonly ai: AiProvider,
    private readonly config: ConfigService,
  ) {}

  listSources(dto: ListTourismSourcesDto) {
    const query = dto.query?.trim();
    return this.prisma.tourismSource.findMany({
      where: {
        authorityLevel: dto.authorityLevel,
        sourceType: dto.sourceType,
        ...(query ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { organization: { contains: query, mode: 'insensitive' as const } },
            { url: { contains: query, mode: 'insensitive' as const } },
          ],
        } : {}),
      },
      select: {
        id: true,
        title: true,
        organization: true,
        sourceType: true,
        authorityLevel: true,
        url: true,
        language: true,
        publishedAt: true,
        validFrom: true,
        validTo: true,
        lastVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { knowledge: true, routes: true, routeNodes: true, routeEdges: true, assessmentQuestions: true } },
      },
      orderBy: [{ lastVerifiedAt: 'asc' }, { createdAt: 'desc' }],
      take: dto.limit,
    });
  }

  async getSource(id: string) {
    const source = await this.prisma.tourismSource.findUnique({
      where: { id },
      include: {
        knowledge: {
          select: {
            id: true,
            title: true,
            contentHash: true,
            chunkIndex: true,
            region: true,
            routeFamily: true,
            category: true,
            language: true,
            tokenCount: true,
            active: true,
            lastVerifiedAt: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: [{ title: 'asc' }, { chunkIndex: 'asc' }],
        },
      },
    });
    if (!source) throw new NotFoundException('Tourism source not found');
    return source;
  }

  createSource(dto: CreateTourismSourceDto) {
    this.assertVerificationDate(dto.lastVerifiedAt);
    if (dto.validFrom && dto.validTo && new Date(dto.validTo) < new Date(dto.validFrom)) {
      throw new BadRequestException('validTo must be on or after validFrom');
    }
    return this.prisma.tourismSource.create({ data: {
      title: dto.title.trim(), organization: dto.organization.trim(), sourceType: dto.sourceType,
      authorityLevel: dto.authorityLevel, url: dto.url, language: dto.language.toLowerCase(),
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : null, validTo: dto.validTo ? new Date(dto.validTo) : null,
      lastVerifiedAt: new Date(dto.lastVerifiedAt),
    } });
  }

  async reviewSource(reviewerId: string, id: string, dto: ReviewTourismSourceDto) {
    this.assertVerificationDate(dto.lastVerifiedAt);
    const existing = await this.prisma.tourismSource.findUnique({ where: { id }, select: { id: true, validFrom: true } });
    if (!existing) throw new NotFoundException('Tourism source not found');
    if (dto.validTo && existing.validFrom && new Date(dto.validTo) < existing.validFrom) {
      throw new BadRequestException('validTo must be on or after validFrom');
    }
    const reviewedAt = new Date(dto.lastVerifiedAt);
    const source = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.tourismSource.update({
        where: { id },
        data: {
          lastVerifiedAt: reviewedAt,
          validTo: dto.validTo ? new Date(dto.validTo) : undefined,
          authorityLevel: dto.authorityLevel,
        },
      });
      if (dto.disableKnowledge !== undefined) {
        await tx.tourismKnowledge.updateMany({
          where: { sourceId: id },
          data: { active: !dto.disableKnowledge, lastVerifiedAt: reviewedAt },
        });
      }
      return updated;
    });
    this.logger.log(JSON.stringify({ event: 'tourism_source_reviewed', reviewerId, sourceId: id, disableKnowledge: dto.disableKnowledge ?? null }));
    return source;
  }

  async reviewKnowledge(reviewerId: string, id: string, dto: ReviewTourismKnowledgeDto) {
    if (dto.lastVerifiedAt) this.assertVerificationDate(dto.lastVerifiedAt);
    const changed = await this.prisma.tourismKnowledge.updateMany({
      where: { id },
      data: {
        active: dto.active,
        lastVerifiedAt: dto.lastVerifiedAt ? new Date(dto.lastVerifiedAt) : undefined,
      },
    });
    if (changed.count !== 1) throw new NotFoundException('Tourism knowledge chunk not found');
    this.logger.log(JSON.stringify({ event: 'tourism_knowledge_reviewed', reviewerId, knowledgeId: id, active: dto.active }));
    return this.prisma.tourismKnowledge.findUnique({
      where: { id },
      select: { id: true, sourceId: true, title: true, chunkIndex: true, active: true, lastVerifiedAt: true, updatedAt: true },
    });
  }

  async ingest(dto: IngestTourismKnowledgeDto) {
    const source = await this.prisma.tourismSource.findUnique({ where: { id: dto.sourceId } });
    if (!source) throw new NotFoundException('Tourism source not found');
    const chunks = this.chunk(dto.content, dto.chunkSize ?? 1200);
    const prepared: Array<{
      chunkIndex: number;
      content: string;
      contentHash: string;
      embedding: number[];
      embeddingModel: string;
    }> = [];
    for (const [chunkIndex, content] of chunks.entries()) {
      const contentHash = createHash('sha256').update(content).digest('hex');
      const embedding = await this.ai.generateEmbedding(content);
      prepared.push({
        chunkIndex,
        content,
        contentHash,
        embedding,
        embeddingModel: this.embeddingModel(embedding.length),
      });
    }
    // No database rows are changed until every external embedding call succeeds.
    const records = await this.prisma.$transaction(async (tx) => {
      const saved: Array<{ id: string; chunkIndex: number; contentHash: string }> = [];
      for (const item of prepared) {
        const common = {
          title: dto.title.trim(),
          chunkIndex: item.chunkIndex,
          region: dto.region?.trim(),
          routeFamily: dto.routeFamily,
          category: dto.category,
          embedding: item.embedding as Prisma.InputJsonValue,
          embeddingModel: item.embeddingModel,
          metadata: { embeddingDimensions: item.embedding.length },
          tokenCount: Math.ceil(item.content.length / 4),
          lastVerifiedAt: source.lastVerifiedAt,
          active: true,
        };
        saved.push(await tx.tourismKnowledge.upsert({
          where: {
            sourceId_contentHash_language: {
              sourceId: source.id,
              contentHash: item.contentHash,
              language: dto.language.toLowerCase(),
            },
          },
          create: {
            sourceId: source.id,
            content: item.content,
            contentHash: item.contentHash,
            language: dto.language.toLowerCase(),
            ...common,
          },
          update: common,
          select: { id: true, chunkIndex: true, contentHash: true },
        }));
      }
      return saved;
    });
    return { sourceId: source.id, chunks: records.length, records };
  }

  private embeddingModel(dimensions: number) {
    const provider = this.config.get<string>('AI_PROVIDER', 'local');
    const model = provider === 'openai'
      ? this.config.get<string>('AI_EMBEDDING_MODEL', 'text-embedding-3-small')
      : 'local-safe-fnv1a';
    return `${provider}:${model}:${dimensions}`;
  }

  private assertVerificationDate(value: string) {
    const timestamp = new Date(value).getTime();
    if (!Number.isFinite(timestamp) || timestamp > Date.now() + 5 * 60_000) {
      throw new BadRequestException('lastVerifiedAt must be a valid non-future date');
    }
  }

  private chunk(input: string, maxLength: number) {
    const normalized = input.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();
    if (!normalized) return [];
    const paragraphs = normalized.split(/\n{2,}/).map((value) => value.trim()).filter(Boolean);
    const chunks: string[] = [];
    let current = '';
    for (const paragraph of paragraphs) {
      const pieces = paragraph.length <= maxLength ? [paragraph] : paragraph.match(new RegExp(`[\\s\\S]{1,${maxLength}}`, 'g')) ?? [];
      for (const piece of pieces) {
        if (current && current.length + piece.length + 2 > maxLength) { chunks.push(current); current = ''; }
        current = current ? `${current}\n\n${piece}` : piece;
      }
    }
    if (current) chunks.push(current);
    return chunks;
  }
}
