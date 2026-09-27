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
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Prisma,
  PrismaClient,
  RouteFamily,
  RouteNodeType,
  RouteRiskLevel,
  RouteTransportMode,
  TourismAuthorityLevel,
  TourismSourceReviewStatus,
  TourismSourceType,
  type GuideLegalRole,
  type CefrLevel,
} from '../src/generated/prisma/client.js';

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

export interface ResearchDataset {
  sources: SourceRecord[];
  pois: PoiRecord[];
  routes: RouteRecord[];
  edges: EdgeRecord[];
}

export function loadResearchDataset(dataDir = researchDataDir()): ResearchDataset {
  const read = <T>(file: string) => JSON.parse(readFileSync(resolve(dataDir, file), 'utf8')) as T;
  return {
    sources: read<{ sources: SourceRecord[] }>('sources.json').sources,
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

export async function importResearchData(prisma: PrismaClient, dataset = loadResearchDataset()) {
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
  const summary = { sources: sourceIds.size, routes: 0, nodes: 0, edges: 0, deactivatedNodes: 0, deactivatedEdges: 0 };

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
  return summary;
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
