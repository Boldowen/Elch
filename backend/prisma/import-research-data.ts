/**
 * Imports the draft research dataset in ../research/data into PostgreSQL.
 *
 *   cd backend && npm run data:import
 *
 * Idempotent: rows are keyed by stable ids/codes. Sources are created PENDING
 * and an existing human review decision is never overwritten. RouteGraph nodes
 * and edges that disappeared from the files are deactivated, not deleted, so
 * historic itineraries, safety plans and experiment runs keep their references.
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { ConfigService } from '@nestjs/config';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AssessmentCategory,
  AssessmentDifficulty,
  AssessmentQuestionType,
  Prisma,
  PrismaClient,
  RouteFamily,
  RouteNodeType,
  RouteRiskLevel,
  RouteTransportMode,
  TourismAuthorityLevel,
  TourismKnowledgeCategory,
  TourismSourceReviewStatus,
  TourismSourceType,
  type GuideLegalRole,
  type CefrLevel,
} from '../src/generated/prisma/client.js';
import { EmbeddingService } from '../src/modules/ai/embedding.service.js';

const UNVERIFIED_AT = new Date('1970-01-01T00:00:00.000Z');
const DRAFT_NOTICE = 'DRAFT research data compiled for human review. Travel time, season, access, permits and safety must be re-verified for the travel date.';
/** RESEARCH_DATA_DIR (e.g. the read-only mount in Docker) or the repository's research/data. */
export function researchDataDir() {
  return process.env.RESEARCH_DATA_DIR?.trim() || resolve(dirname(fileURLToPath(import.meta.url)), '../../research/data');
}

interface SourceRecord {
  id: string; title: string; organization: string; sourceType: string; authorityLevel: string; authorityTier: number;
  url: string; language: string; publishedAt: string | null; licenseOrUsageNote: string;
}
interface PoiRecord {
  id: string; nameMn: string; nameEn: string; region: string; type: string; latitude: number; longitude: number;
  elevationMeters?: number; coordinate: Record<string, unknown>; sourceIds: string[]; minimumVisitMinutes: number; reviewNotes?: string;
  protectedArea?: { name: string; basis: string };
}
interface RouteRecord {
  id: string; name: string; routeFamily: string; description: string; recommendedDays: { min: number; max: number };
  riskClass: string; coreSequence: string[]; poiIds: string[]; sourceId: string;
  guideRequirements: { minimumLanguageLevel: string; routeBadge: string; firstAidRequired: boolean; legalRole: string; specialtySkills: string[] };
}
interface EdgeRecord {
  id: string; from: string; to: string; mode: string; terrain: string; openMonths: number[] | 'all'; riskClass: string;
  requiredSkills: string[]; sourceId: string; distanceKm: number; distanceBasis: string; nominalMinutes: number; timeBasis: string;
  quality: string; qualityFlags: string[]; openMonthsBasis: string; requiresTransportCheck?: boolean; requiresPermitCheck?: boolean;
  note?: string; knownIssue?: string;
}

interface CorpusRow {
  id: string; sourceId: string; title: string; content: string; category: string; language: string;
  region: string | null; routeFamily: string | null; splitGroup: string; dataStatus: string; provenance: Record<string, unknown>;
}

interface QuestionRow {
  id: string; category: string; routeFamily: string | null; difficulty: string; language: string; questionType: string;
  prompt: string; responseOptions?: string[]; answerKey: Record<string, unknown>; scoringRubric: Record<string, unknown>;
  evidence: Array<{ corpusId: string; quote: string }>; sourceId: string; splitGroup: string; provenance: Record<string, unknown>;
}

export interface ResearchDataset {
  sources: SourceRecord[];
  pois: PoiRecord[];
  routes: RouteRecord[];
  edges: EdgeRecord[];
  corpus: CorpusRow[];
  questions: QuestionRow[];
}

export type CorpusEmbedder = Pick<EmbeddingService, 'embed' | 'identity'>;

export function loadResearchDataset(dataDir = researchDataDir()): ResearchDataset {
  const read = <T>(file: string) => JSON.parse(readFileSync(resolve(dataDir, file), 'utf8')) as T;
  const jsonlDir = <T>(name: string) => {
    const directory = resolve(dataDir, name);
    return existsSync(directory)
      ? readdirSync(directory).filter((file) => file.endsWith('.jsonl')).sort().flatMap((file) =>
        readFileSync(resolve(directory, file), 'utf8').split('\n').filter((line) => line.trim()).map((line) => JSON.parse(line) as T))
      : [];
  };
  const corpus = jsonlDir<CorpusRow>('corpus');
  const questions = jsonlDir<QuestionRow>('question-bank');
  const generatedSources = existsSync(resolve(dataDir, 'sources.wikipedia.json'))
    ? read<{ sources: SourceRecord[] }>('sources.wikipedia.json').sources
    : [];
  return {
    corpus,
    questions,
    sources: [...read<{ sources: SourceRecord[] }>('sources.json').sources, ...generatedSources],
    pois: read<{ pois: PoiRecord[] }>('routegraph/pois.json').pois,
    routes: read<{ routes: RouteRecord[] }>('routegraph/routes.json').routes,
    edges: read<{ edges: EdgeRecord[] }>('routegraph/edges.json').edges,
  };
}

/** Deterministic UUID (v4 layout) so re-imports address the same source rows. */
export function stableUuid(namespace: string, key: string) {
  const hex = createHash('sha256').update(`elch:${namespace}:${key}`).digest('hex');
  const variant = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function enumValue<T extends Record<string, string>>(values: T, value: string, label: string): T[keyof T] {
  if (!(value in values)) throw new Error(`Unknown ${label}: ${value}`);
  return values[value as keyof T];
}

function months(value: number[] | 'all') {
  return value === 'all' ? Array.from({ length: 12 }, (_, index) => index + 1) : value;
}

export async function importResearchData(
  prisma: PrismaClient,
  dataset = loadResearchDataset(),
  embedder: CorpusEmbedder = new EmbeddingService(new ConfigService(process.env)),
) {
  const sourceIds = new Map<string, string>();
  for (const source of dataset.sources) {
    const id = stableUuid('source', source.id);
    const data = {
      title: source.title,
      organization: source.organization,
      sourceType: enumValue(TourismSourceType, source.sourceType, 'sourceType'),
      authorityLevel: enumValue(TourismAuthorityLevel, source.authorityLevel, 'authorityLevel'),
      url: source.url,
      language: source.language.slice(0, 16),
      publishedAt: source.publishedAt ? new Date(source.publishedAt) : null,
      licenseOrUsageNote: source.licenseOrUsageNote,
    };
    // Review fields are only written on create: a recorded human decision survives re-imports.
    await prisma.tourismSource.upsert({
      where: { id },
      update: data,
      create: { id, ...data, reviewStatus: TourismSourceReviewStatus.PENDING, lastVerifiedAt: UNVERIFIED_AT },
    });
    sourceIds.set(source.id, id);
  }
  const sourceId = (key: string) => {
    const id = sourceIds.get(key);
    if (!id) throw new Error(`Unknown source id ${key}`);
    return id;
  };

  const poiById = new Map(dataset.pois.map((poi) => [poi.id, poi]));
  const summary = {
    sources: sourceIds.size, routes: 0, nodes: 0, edges: 0, deactivatedNodes: 0, deactivatedEdges: 0,
    knowledge: 0, knowledgeEmbedded: 0, deactivatedKnowledge: 0, questions: 0,
  };

  for (const route of dataset.routes) {
    const routeData = {
      sourceId: sourceId(route.sourceId),
      name: route.name,
      routeFamily: enumValue(RouteFamily, route.routeFamily, 'routeFamily'),
      description: `${route.description} ${DRAFT_NOTICE}`,
      minimumDays: route.recommendedDays.min,
      recommendedDays: route.recommendedDays.max,
      riskLevel: enumValue(RouteRiskLevel, route.riskClass, 'riskClass'),
      minimumLanguageLevel: route.guideRequirements.minimumLanguageLevel as CefrLevel,
      routeBadge: route.guideRequirements.routeBadge,
      firstAidRequired: route.guideRequirements.firstAidRequired,
      requiredGuideLegalRole: route.guideRequirements.legalRole as GuideLegalRole,
      requiredSpecialtySkills: route.guideRequirements.specialtySkills,
      active: true,
    };
    const saved = await prisma.researchRoute.upsert({
      where: { code: route.id },
      update: routeData,
      create: { code: route.id, ...routeData },
    });
    summary.routes += 1;

    const nodeIds = new Map<string, string>();
    for (const [index, poiId] of route.poiIds.entries()) {
      const poi = poiById.get(poiId);
      if (!poi) throw new Error(`Route ${route.id} references unknown POI ${poiId}`);
      const coreIndex = route.coreSequence.indexOf(poiId);
      const nodeData = {
        sourceId: sourceId(poi.sourceIds[0]),
        destinationId: null,
        name: `${poi.nameEn} / ${poi.nameMn}`,
        nameMn: poi.nameMn,
        nameEn: poi.nameEn,
        region: poi.region,
        latitude: poi.latitude,
        longitude: poi.longitude,
        altitude: poi.elevationMeters ?? null,
        nodeType: enumValue(RouteNodeType, poi.type, 'node type'),
        sequenceHint: coreIndex >= 0 ? coreIndex + 1 : route.coreSequence.length + index + 1,
        minimumVisitMinutes: poi.minimumVisitMinutes,
        seasonalityMetadata: { verificationStatus: 'DRAFT_REQUIRES_REVIEW', note: 'No verified node-level season rule yet.' },
        accessMetadata: {
          verificationStatus: 'DRAFT_REQUIRES_REVIEW',
          coordinate: poi.coordinate,
          coreSequence: coreIndex >= 0,
          sourceIds: poi.sourceIds,
          ...(poi.protectedArea ? { protectedArea: poi.protectedArea } : {}),
          ...(poi.reviewNotes ? { reviewNotes: poi.reviewNotes } : {}),
        } as Prisma.InputJsonValue,
        safetyMetadata: { classification: 'RESEARCH_ONLY', notice: DRAFT_NOTICE },
        active: true,
      };
      const node = await prisma.routeNode.upsert({
        where: { routeId_code: { routeId: saved.id, code: poi.id } },
        update: nodeData,
        create: { routeId: saved.id, code: poi.id, ...nodeData },
      });
      nodeIds.set(poi.id, node.id);
      summary.nodes += 1;
    }

    const routeEdges = dataset.edges.filter((edge) => nodeIds.has(edge.from) && nodeIds.has(edge.to));
    for (const edge of routeEdges) {
      const riskLevel = enumValue(RouteRiskLevel, edge.riskClass, 'riskClass');
      const transportMode = enumValue(RouteTransportMode, edge.mode, 'transport mode');
      const elevatedRisk = riskLevel === RouteRiskLevel.R2 || riskLevel === RouteRiskLevel.R3 || riskLevel === RouteRiskLevel.R4;
      const edgeData = {
        fromNodeId: nodeIds.get(edge.from)!,
        toNodeId: nodeIds.get(edge.to)!,
        sourceId: sourceId(edge.sourceId),
        transportMode,
        distanceKm: edge.distanceKm,
        estimatedTravelMinutes: edge.nominalMinutes,
        estimatedCostMinor: null,
        estimatedCostCurrency: null,
        terrain: edge.terrain,
        riskLevel,
        seasonality: {
          openMonths: months(edge.openMonths),
          openMonthsBasis: edge.openMonthsBasis,
          distanceBasis: edge.distanceBasis,
          timeBasis: edge.timeBasis,
          quality: edge.quality,
          qualityFlags: edge.qualityFlags,
          verificationStatus: 'PENDING_FIELD_VERIFICATION',
          ...(edge.note ? { note: edge.note } : {}),
          ...(edge.knownIssue ? { knownIssue: edge.knownIssue } : {}),
        } as Prisma.InputJsonValue,
        bidirectional: true,
        requiresRoadCheck: transportMode === RouteTransportMode.ROAD || transportMode === RouteTransportMode.OFF_ROAD,
        requiresWeatherCheck: riskLevel !== RouteRiskLevel.R0,
        // Permits/fees apply to protected areas and border zones; ordinary roads are not gated.
        requiresPermitCheck: Boolean(
          edge.requiresPermitCheck || poiById.get(edge.from)?.protectedArea || poiById.get(edge.to)?.protectedArea,
        ),
        requiresGuide: edge.requiredSkills.length > 0,
        requiredGuideCompetencies: edge.requiredSkills,
        emergencyPlanRequired: elevatedRisk,
        active: true,
        lastVerifiedAt: UNVERIFIED_AT,
      };
      const existing = await prisma.routeEdge.findUnique({ where: { routeId_code: { routeId: saved.id, code: edge.id } } });
      if (existing) {
        await prisma.routeEdge.update({ where: { id: existing.id }, data: edgeData });
      } else {
        // A stale edge may still own this endpoint/mode combination under an old code.
        await prisma.routeEdge.updateMany({
          where: { routeId: saved.id, fromNodeId: edgeData.fromNodeId, toNodeId: edgeData.toNodeId, transportMode },
          data: { code: edge.id },
        });
        await prisma.routeEdge.upsert({
          where: { routeId_code: { routeId: saved.id, code: edge.id } },
          update: edgeData,
          create: { routeId: saved.id, code: edge.id, ...edgeData },
        });
      }
      summary.edges += 1;
    }

    const staleNodes = await prisma.routeNode.updateMany({
      where: { routeId: saved.id, code: { notIn: route.poiIds }, active: true },
      data: { active: false },
    });
    const staleEdges = await prisma.routeEdge.updateMany({
      where: { routeId: saved.id, code: { notIn: routeEdges.map((edge) => edge.id) }, active: true },
      data: { active: false },
    });
    summary.deactivatedNodes += staleNodes.count;
    summary.deactivatedEdges += staleEdges.count;
  }

  await importCorpus(prisma, dataset.corpus, sourceId, embedder, summary);
  summary.questions = await importQuestions(prisma, dataset.questions, sourceId);
  return summary;
}

/**
 * Draft items stay inactive until an expert activates them (plan gate G2), so a
 * candidate is never examined on unreviewed content. RESEARCH_ACTIVATE_DRAFT_QUESTIONS
 * exists only for local demos. Evidence travels inside answerKey, which the
 * guide-facing APIs never return.
 */
async function importQuestions(prisma: PrismaClient, rows: QuestionRow[], sourceId: (key: string) => string) {
  const activateDrafts = process.env.RESEARCH_ACTIVATE_DRAFT_QUESTIONS === 'true';
  for (const row of rows) {
    const id = stableUuid('question', row.id);
    const data = {
      category: enumValue(AssessmentCategory, row.category, 'question category'),
      routeFamily: row.routeFamily ? enumValue(RouteFamily, row.routeFamily, 'routeFamily') : null,
      difficulty: enumValue(AssessmentDifficulty, row.difficulty, 'difficulty'),
      language: row.language,
      questionType: enumValue(AssessmentQuestionType, row.questionType, 'question type'),
      prompt: row.prompt,
      responseOptions: (row.responseOptions ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      answerKey: { ...row.answerKey, evidence: row.evidence, bankId: row.id, splitGroup: row.splitGroup } as Prisma.InputJsonValue,
      scoringRubric: row.scoringRubric as Prisma.InputJsonValue,
      sourceId: sourceId(row.sourceId),
    };
    // Activation is a review decision: re-imports never re-activate or deactivate an existing item.
    await prisma.assessmentQuestion.upsert({
      where: { id },
      update: data,
      create: { id, ...data, active: activateDrafts },
    });
  }
  return rows.length;
}

/**
 * Knowledge chunks follow the ingestion rule: active only while their source is
 * HUMAN_VERIFIED (source review activates them later). Unchanged chunks keep
 * their vector when the embedding identity still matches.
 */
async function importCorpus(
  prisma: PrismaClient,
  rows: CorpusRow[],
  sourceId: (key: string) => string,
  embedder: CorpusEmbedder,
  summary: { knowledge: number; knowledgeEmbedded: number; deactivatedKnowledge: number },
) {
  const bySource = new Map<string, CorpusRow[]>();
  for (const row of rows) bySource.set(row.sourceId, [...(bySource.get(row.sourceId) ?? []), row]);
  for (const [key, sourceRows] of bySource) {
    const id = sourceId(key);
    const source = await prisma.tourismSource.findUniqueOrThrow({ where: { id } });
    const verified = source.reviewStatus === TourismSourceReviewStatus.HUMAN_VERIFIED;
    const hashes: string[] = [];
    for (const [chunkIndex, row] of sourceRows.entries()) {
      const language = row.language.toLowerCase();
      const contentHash = createHash('sha256').update(row.content).digest('hex');
      hashes.push(contentHash);
      const where = { sourceId_contentHash_language: { sourceId: id, contentHash, language } };
      const existing = await prisma.tourismKnowledge.findUnique({ where, select: { embeddingModel: true, embedding: true } });
      let embedding = existing?.embedding ?? null;
      let embeddingModel = existing?.embeddingModel ?? null;
      const currentModel = Array.isArray(embedding) ? embedder.identity(embedding.length) : null;
      if (!embedding || embeddingModel !== currentModel) {
        const vector = await embedder.embed(row.content);
        embedding = vector as Prisma.JsonValue;
        embeddingModel = embedder.identity(vector.length);
        summary.knowledgeEmbedded += 1;
      }
      const data = {
        title: row.title.slice(0, 500),
        chunkIndex,
        region: row.region,
        routeFamily: row.routeFamily ? enumValue(RouteFamily, row.routeFamily, 'routeFamily') : null,
        category: enumValue(TourismKnowledgeCategory, row.category, 'knowledge category'),
        embedding: embedding as Prisma.InputJsonValue,
        embeddingModel,
        tokenCount: Math.ceil(row.content.length / 4),
        metadata: {
          corpusId: row.id,
          splitGroup: row.splitGroup,
          dataStatus: row.dataStatus,
          provenance: row.provenance,
          sourceReviewStatus: source.reviewStatus,
        } as Prisma.InputJsonValue,
        lastVerifiedAt: source.lastVerifiedAt,
        active: verified,
      };
      await prisma.tourismKnowledge.upsert({
        where,
        update: data,
        create: { sourceId: id, content: row.content, contentHash, language, ...data },
      });
      summary.knowledge += 1;
    }
    // Chunks whose text left the corpus files are retired, never silently kept active.
    const stale = await prisma.tourismKnowledge.updateMany({
      where: { sourceId: id, contentHash: { notIn: hashes }, active: true },
      data: { active: false },
    });
    summary.deactivatedKnowledge += stale.count;
  }
}

async function main() {
  await import('dotenv/config');
  const { PrismaPg } = await import('@prisma/adapter-pg');
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  try {
    console.log(await importResearchData(prisma, loadResearchDataset(process.argv[2])));
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
