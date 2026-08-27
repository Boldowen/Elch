import {
  AssessmentCategory,
  AssessmentDifficulty,
  AssessmentQuestionType,
  PrismaClient,
  RouteFamily,
  RouteNodeType,
  RouteRiskLevel,
  RouteTransportMode,
  TourismAuthorityLevel,
  TourismKnowledgeCategory,
  TourismSourceType,
} from '../src/generated/prisma/client.js';
import { ROUTE_GRAPH } from '../src/modules/route-planning/route-graph.data.js';
import { createHash } from 'node:crypto';

const UNVERIFIED_AT = new Date('1970-01-01T00:00:00.000Z');
const PROTOTYPE_NOTICE =
  'PROTOTYPE / DEMO ONLY. Facts, access, travel time, price, safety, permits, and source currency require human re-verification before use.';

const sourceIds: Record<string, string> = {
  'mto-central': '10000000-0000-4000-8000-000000000001',
  omnogovi: '10000000-0000-4000-8000-000000000002',
  khuvsgul: '10000000-0000-4000-8000-000000000003',
  'unesco-orkhon': '10000000-0000-4000-8000-000000000004',
  'unesco-altai': '10000000-0000-4000-8000-000000000005',
  'assessment-demo': '10000000-0000-4000-8000-000000000006',
};

const sourceAuthority: Record<string, TourismAuthorityLevel> = {
  'mto-central': TourismAuthorityLevel.OFFICIAL_TOURISM,
  omnogovi: TourismAuthorityLevel.LOCAL_AUTHORITY,
  khuvsgul: TourismAuthorityLevel.LOCAL_AUTHORITY,
  'unesco-orkhon': TourismAuthorityLevel.UNESCO,
  'unesco-altai': TourismAuthorityLevel.UNESCO,
};

const routeFamilies: Record<string, RouteFamily> = {
  'central-heritage': RouteFamily.CENTRAL_HERITAGE,
  gobi: RouteFamily.GOBI,
  khuvsgul: RouteFamily.KHUVSGUL,
  'western-altai': RouteFamily.WESTERN_ALTAI,
};

const routePrimarySources: Record<string, string> = {
  'central-heritage': 'unesco-orkhon',
  gobi: 'omnogovi',
  khuvsgul: 'khuvsgul',
  'western-altai': 'unesco-altai',
};

const routeRisks: Record<string, RouteRiskLevel> = {
  R0: RouteRiskLevel.R0,
  R1: RouteRiskLevel.R1,
  R2: RouteRiskLevel.R2,
  R3: RouteRiskLevel.R3,
  R4: RouteRiskLevel.R4,
};

const nodeTypes: Record<string, RouteNodeType> = {
  CITY: RouteNodeType.CITY,
  HERITAGE: RouteNodeType.HERITAGE,
  NATURE: RouteNodeType.NATURE,
  MUSEUM: RouteNodeType.MUSEUM,
  TRAILHEAD: RouteNodeType.TRAILHEAD,
};

const transportModes: Record<string, RouteTransportMode> = {
  ROAD: RouteTransportMode.ROAD,
  OFF_ROAD: RouteTransportMode.OFF_ROAD,
  TREK: RouteTransportMode.TREK,
  BOAT: RouteTransportMode.BOAT,
};

const questionIds = {
  general: '50000000-0000-4000-8000-000000000001',
  central: '50000000-0000-4000-8000-000000000002',
  gobi: '50000000-0000-4000-8000-000000000003',
  khuvsgul: '50000000-0000-4000-8000-000000000004',
  altai: '50000000-0000-4000-8000-000000000005',
  language: '50000000-0000-4000-8000-000000000006',
  safety: '50000000-0000-4000-8000-000000000007',
  firstAid: '50000000-0000-4000-8000-000000000008',
  history: '50000000-0000-4000-8000-000000000009',
  culture: '50000000-0000-4000-8000-000000000010',
  geography: '50000000-0000-4000-8000-000000000011',
  society: '50000000-0000-4000-8000-000000000012',
  languageDestination: '50000000-0000-4000-8000-000000000013',
  languageQuestions: '50000000-0000-4000-8000-000000000014',
  languageSimplify: '50000000-0000-4000-8000-000000000015',
  languageEmergency: '50000000-0000-4000-8000-000000000016',
  guideSkill: '50000000-0000-4000-8000-000000000017',
  firstAidScenario: '50000000-0000-4000-8000-000000000018',
};

interface ResearchQuestionSeed {
  id: string;
  category: AssessmentCategory;
  routeFamily: RouteFamily | null;
  difficulty: AssessmentDifficulty;
  language: string;
  questionType: AssessmentQuestionType;
  prompt: string;
  responseOptions?: string[];
  answerKey: Record<string, unknown>;
  sourceId: string;
}

export async function seedResearchData(prisma: PrismaClient) {
  for (const source of ROUTE_GRAPH.sources) {
    const data = {
      title: `[PROTOTYPE / NOT VERIFIED] ${source.title}`,
      organization: 'ELCH prototype source registry; source owner not contacted',
      sourceType: TourismSourceType.WEBSITE,
      authorityLevel: sourceAuthority[source.id] ?? TourismAuthorityLevel.OTHER,
      url: source.url,
      language: 'en',
      publishedAt: null,
      validFrom: null,
      validTo: null,
      // The required timestamp deliberately remains stale until a human verifies
      // the exact content, scope, and reuse terms represented by this record.
      lastVerifiedAt: UNVERIFIED_AT,
    };
    await prisma.tourismSource.upsert({
      where: { id: sourceIds[source.id] },
      update: data,
      create: { id: sourceIds[source.id], ...data },
    });
  }

  const demoAssessmentSource = {
    title: '[DEMO PLACEHOLDER / NOT VERIFIED] Assessment methodology reference',
    organization: 'ELCH research demo',
    sourceType: TourismSourceType.OTHER,
    authorityLevel: TourismAuthorityLevel.OTHER,
    url: 'https://example.invalid/elch/research/demo-assessment-source',
    language: 'en',
    publishedAt: null,
    validFrom: null,
    validTo: null,
    lastVerifiedAt: UNVERIFIED_AT,
  };
  await prisma.tourismSource.upsert({
    where: { id: sourceIds['assessment-demo'] },
    update: demoAssessmentSource,
    create: { id: sourceIds['assessment-demo'], ...demoAssessmentSource },
  });

  let knowledgeCount = 0;
  for (const route of ROUTE_GRAPH.routes) {
    const sourceId = sourceIds[routePrimarySources[route.id]];
    const routeFamily = routeFamilies[route.id];
    if (!sourceId || !routeFamily) continue;
    const content = [
      `[PROTOTYPE / NOT VERIFIED] ${route.name}.`,
      route.description,
      `Research-only duration range: ${route.recommendedDays.min}-${route.recommendedDays.max} days.`,
      `Declared route risk: ${route.riskClass}.`,
      PROTOTYPE_NOTICE,
    ].join(' ');
    const contentHash = createHash('sha256').update(content).digest('hex');
    await prisma.tourismKnowledge.upsert({
      where: {
        sourceId_contentHash_language: { sourceId, contentHash, language: 'en' },
      },
      update: {
        title: `[PROTOTYPE / NOT VERIFIED] ${route.name}`,
        content,
        chunkIndex: 0,
        region: route.name,
        routeFamily,
        category: TourismKnowledgeCategory.ROUTE_INFORMATION,
        embedding: null,
        embeddingModel: null,
        tokenCount: Math.ceil(content.length / 4),
        metadata: { verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW' },
        active: true,
        lastVerifiedAt: UNVERIFIED_AT,
      },
      create: {
        sourceId,
        title: `[PROTOTYPE / NOT VERIFIED] ${route.name}`,
        content,
        contentHash,
        chunkIndex: 0,
        region: route.name,
        routeFamily,
        category: TourismKnowledgeCategory.ROUTE_INFORMATION,
        language: 'en',
        embedding: null,
        embeddingModel: null,
        tokenCount: Math.ceil(content.length / 4),
        metadata: { verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW' },
        active: true,
        lastVerifiedAt: UNVERIFIED_AT,
      },
    });
    knowledgeCount += 1;
  }

  const routeIds = new Map<string, string>();
  const nodeIds = new Map<string, string>();

  for (const route of ROUTE_GRAPH.routes) {
    const routeFamily = routeFamilies[route.id];
    const primarySourceId = sourceIds[routePrimarySources[route.id]];
    if (!routeFamily || !primarySourceId) {
      throw new Error(`Missing research seed mapping for route ${route.id}`);
    }
    const description = [
      `[PROTOTYPE] ${route.description}`,
      `Static planning range: ${route.recommendedDays.min}-${route.recommendedDays.max} days.`,
      PROTOTYPE_NOTICE,
    ].join(' ');
    const seededRoute = await prisma.researchRoute.upsert({
      where: { code: route.id },
      update: {
        sourceId: primarySourceId,
        name: `[PROTOTYPE] ${route.name}`,
        routeFamily,
        description,
        minimumDays: route.recommendedDays.min,
        recommendedDays: route.recommendedDays.max,
        riskLevel: routeRisks[route.riskClass],
        minimumLanguageLevel: route.guideRequirements.minimumLanguageLevel as 'B2',
        routeBadge: route.guideRequirements.routeBadge,
        firstAidRequired: route.guideRequirements.firstAidRequired,
        requiredGuideLegalRole: route.guideRequirements.legalRole,
        requiredSpecialtySkills: route.guideRequirements.specialtySkills,
        active: true,
      },
      create: {
        code: route.id,
        sourceId: primarySourceId,
        name: `[PROTOTYPE] ${route.name}`,
        routeFamily,
        description,
        minimumDays: route.recommendedDays.min,
        recommendedDays: route.recommendedDays.max,
        riskLevel: routeRisks[route.riskClass],
        minimumLanguageLevel: route.guideRequirements.minimumLanguageLevel as 'B2',
        routeBadge: route.guideRequirements.routeBadge,
        firstAidRequired: route.guideRequirements.firstAidRequired,
        requiredGuideLegalRole: route.guideRequirements.legalRole,
        requiredSpecialtySkills: route.guideRequirements.specialtySkills,
        active: true,
      },
    });
    routeIds.set(route.id, seededRoute.id);

    for (const [sequence, poiId] of route.poiIds.entries()) {
      const poi = ROUTE_GRAPH.pois.find((candidate) => candidate.id === poiId);
      if (!poi) throw new Error(`Missing POI ${poiId} for route ${route.id}`);
      const nodeType = nodeTypes[poi.type];
      const sourceId = sourceIds[poi.sourceId];
      if (!nodeType || !sourceId) throw new Error(`Missing research seed mapping for POI ${poi.id}`);
      const seededNode = await prisma.routeNode.upsert({
        where: { routeId_code: { routeId: seededRoute.id, code: poi.id } },
        update: {
          sourceId,
          destinationId: null,
          name: `[PROTOTYPE] ${poi.nameEn} / ${poi.nameMn}`,
          nameMn: poi.nameMn,
          nameEn: poi.nameEn,
          region: poi.region,
          latitude: poi.latitude,
          longitude: poi.longitude,
          altitude: poi.elevationMeters ?? null,
          nodeType,
          sequenceHint: sequence + 1,
          minimumVisitMinutes: 0,
          seasonalityMetadata: {
            verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW',
            note: 'No verified node-level season rule has been seeded.',
          },
          accessMetadata: {
            verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW',
            note: 'Confirm current access and permit requirements before travel.',
          },
          safetyMetadata: { classification: 'RESEARCH_ONLY', notice: PROTOTYPE_NOTICE },
          active: true,
        },
        create: {
          routeId: seededRoute.id,
          sourceId,
          destinationId: null,
          code: poi.id,
          name: `[PROTOTYPE] ${poi.nameEn} / ${poi.nameMn}`,
          nameMn: poi.nameMn,
          nameEn: poi.nameEn,
          region: poi.region,
          latitude: poi.latitude,
          longitude: poi.longitude,
          altitude: poi.elevationMeters ?? null,
          nodeType,
          sequenceHint: sequence + 1,
          minimumVisitMinutes: 0,
          seasonalityMetadata: {
            verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW',
            note: 'No verified node-level season rule has been seeded.',
          },
          accessMetadata: {
            verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW',
            note: 'Confirm current access and permit requirements before travel.',
          },
          safetyMetadata: { classification: 'RESEARCH_ONLY', notice: PROTOTYPE_NOTICE },
          active: true,
        },
      });
      nodeIds.set(`${route.id}:${poi.id}`, seededNode.id);
    }
  }

  for (const route of ROUTE_GRAPH.routes) {
    const routeId = routeIds.get(route.id);
    if (!routeId) throw new Error(`Research route ${route.id} was not seeded`);
    const routeEdges = ROUTE_GRAPH.edges.filter(
      (edge) => route.poiIds.includes(edge.from) && route.poiIds.includes(edge.to),
    );
    for (const edge of routeEdges) {
      const fromNodeId = nodeIds.get(`${route.id}:${edge.from}`);
      const toNodeId = nodeIds.get(`${route.id}:${edge.to}`);
      const sourceId = sourceIds[edge.sourceId];
      const transportMode = transportModes[edge.mode];
      const riskLevel = routeRisks[edge.riskClass];
      if (!fromNodeId || !toNodeId || !sourceId || !transportMode || !riskLevel) {
        throw new Error(`Missing research seed mapping for edge ${edge.id}`);
      }
      const data = {
        code: edge.id,
        sourceId,
        distanceKm: edge.distanceKm,
        estimatedTravelMinutes: edge.nominalMinutes,
        estimatedCostMinor: edge.estimatedCostMinor ?? null,
        estimatedCostCurrency: edge.estimatedCostMinor === undefined ? null : 'USD',
        terrain: edge.mode,
        riskLevel,
        seasonality: {
          openMonthsPrototype: edge.openMonths,
          verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW',
          estimatedCostStatus: 'DEMO_ONLY_NOT_A_QUOTE',
          notice: PROTOTYPE_NOTICE,
        },
        bidirectional: true,
        requiresRoadCheck:
          transportMode === RouteTransportMode.ROAD || transportMode === RouteTransportMode.OFF_ROAD,
        requiresWeatherCheck: riskLevel !== RouteRiskLevel.R0 && riskLevel !== RouteRiskLevel.R1,
        // The static graph does not contain verified permit data, so every edge
        // remains gated on a current permit/access check.
        requiresPermitCheck: true,
        requiresGuide: edge.requiredSkills.length > 0,
        requiredGuideCompetencies: edge.requiredSkills,
        emergencyPlanRequired:
          riskLevel === RouteRiskLevel.R2 ||
          riskLevel === RouteRiskLevel.R3 ||
          riskLevel === RouteRiskLevel.R4,
        active: true,
        lastVerifiedAt: UNVERIFIED_AT,
      };
      await prisma.routeEdge.upsert({
        where: {
          routeId_fromNodeId_toNodeId_transportMode: {
            routeId,
            fromNodeId,
            toNodeId,
            transportMode,
          },
        },
        update: data,
        create: { routeId, fromNodeId, toNodeId, transportMode, ...data },
      });
    }
  }

  const demoRubric = {
    status: 'DEMO_RUBRIC_REQUIRES_HUMAN_REVIEW',
    maxScore: 100,
    dimensions: ['accuracy', 'clarity', 'safety', 'source-awareness'],
    notice: 'This rubric is not an official guide, language, or first-aid certification.',
  };
  const questions: ResearchQuestionSeed[] = [
    {
      id: questionIds.general,
      category: AssessmentCategory.LAW_ETHICS,
      routeFamily: null,
      difficulty: AssessmentDifficulty.BASIC,
      language: 'en',
      questionType: AssessmentQuestionType.MULTIPLE_CHOICE,
      prompt:
        '[DEMO / NOT FOR CERTIFICATION] Which approach best distinguishes a verified tourism fact from personal interpretation?',
      responseOptions: [
        'A. Name the source, date, and uncertainty before adding a clearly labeled interpretation.',
        'B. Present the most plausible version as confirmed so visitors are not confused.',
        'C. Remove the source because citations make an explanation less engaging.',
        'D. Treat all operator marketing text as a legal requirement.',
      ],
      answerKey: {
        correctOption: 'A',
        verificationStatus: 'DEMO_REQUIRES_EXPERT_REVIEW',
      },
      sourceId: sourceIds['mto-central'],
    },
    {
      id: questionIds.central,
      category: AssessmentCategory.ROUTE_SPECIFIC,
      routeFamily: RouteFamily.CENTRAL_HERITAGE,
      difficulty: AssessmentDifficulty.INTERMEDIATE,
      language: 'en',
      questionType: AssessmentQuestionType.SCENARIO,
      prompt:
        '[DEMO / NOT FOR CERTIFICATION] Outline a source-aware visitor briefing for the prototype Central Heritage route without inventing site rules.',
      answerKey: {
        expectedBehaviors: ['separate sourced facts from suggestions', 'confirm current site access', 'respect heritage protections'],
        verificationStatus: 'DEMO_REQUIRES_EXPERT_REVIEW',
      },
      sourceId: sourceIds['unesco-orkhon'],
    },
    {
      id: questionIds.gobi,
      category: AssessmentCategory.ROUTE_SPECIFIC,
      routeFamily: RouteFamily.GOBI,
      difficulty: AssessmentDifficulty.INTERMEDIATE,
      language: 'en',
      questionType: AssessmentQuestionType.SCENARIO,
      prompt:
        '[DEMO / NOT FOR CERTIFICATION] A prototype Gobi segment is marked remote and off-road. Describe the checks required before departure.',
      answerKey: {
        expectedBehaviors: ['current road check', 'weather check', 'water and communications plan', 'emergency escalation plan'],
        verificationStatus: 'DEMO_REQUIRES_EXPERT_REVIEW',
      },
      sourceId: sourceIds.omnogovi,
    },
    {
      id: questionIds.khuvsgul,
      category: AssessmentCategory.ROUTE_SPECIFIC,
      routeFamily: RouteFamily.KHUVSGUL,
      difficulty: AssessmentDifficulty.INTERMEDIATE,
      language: 'en',
      questionType: AssessmentQuestionType.SCENARIO,
      prompt:
        '[DEMO / NOT FOR CERTIFICATION] Explain how you would re-check conditions before using a prototype lake or boat segment.',
      answerKey: {
        expectedBehaviors: ['weather confirmation', 'operator and equipment verification', 'cold and water safety briefing', 'alternative plan'],
        verificationStatus: 'DEMO_REQUIRES_EXPERT_REVIEW',
      },
      sourceId: sourceIds.khuvsgul,
    },
    {
      id: questionIds.altai,
      category: AssessmentCategory.ROUTE_SPECIFIC,
      routeFamily: RouteFamily.WESTERN_ALTAI,
      difficulty: AssessmentDifficulty.ADVANCED,
      language: 'en',
      questionType: AssessmentQuestionType.SCENARIO,
      prompt:
        '[DEMO / NOT FOR CERTIFICATION] Describe when a prototype Western Altai trek should be stopped or escalated to specialist review.',
      answerKey: {
        expectedBehaviors: ['recognize changing weather or condition limits', 'do not bypass R3 safety gates', 'use a qualified specialist and evacuation plan'],
        verificationStatus: 'DEMO_REQUIRES_EXPERT_REVIEW',
      },
      sourceId: sourceIds['unesco-altai'],
    },
    {
      id: questionIds.language,
      category: AssessmentCategory.LANGUAGE,
      routeFamily: null,
      difficulty: AssessmentDifficulty.INTERMEDIATE,
      language: 'en',
      questionType: AssessmentQuestionType.SPEAKING_TASK,
      prompt:
        '[DEMO AI LANGUAGE ESTIMATE ONLY] Welcome first-time visitors, introduce yourself, and explain that current route conditions still require confirmation.',
      answerKey: {
        expectedBehaviors: ['clear welcome', 'plain-language explanation', 'transparent uncertainty', 'invite questions'],
        verificationStatus: 'DEMO_AI_ESTIMATE_NOT_OFFICIAL_CEFR',
      },
      sourceId: sourceIds['assessment-demo'],
    },
    {
      id: questionIds.safety,
      category: AssessmentCategory.SAFETY,
      routeFamily: RouteFamily.GOBI,
      difficulty: AssessmentDifficulty.ADVANCED,
      language: 'en',
      questionType: AssessmentQuestionType.SCENARIO,
      prompt:
        '[DEMO / NOT FOR CERTIFICATION] Communications fail during remote travel. Explain how you would avoid false reassurance and activate the pre-agreed escalation plan.',
      answerKey: {
        expectedBehaviors: ['recognize risk', 'stop unsafe progression', 'use the documented communications fallback', 'seek qualified local assistance'],
        unsafeBehaviors: ['inventing emergency coverage', 'continuing without an escalation plan'],
        verificationStatus: 'DEMO_REQUIRES_EXPERT_REVIEW',
      },
      sourceId: sourceIds.omnogovi,
    },
    {
      id: questionIds.firstAid,
      category: AssessmentCategory.FIRST_AID_THEORY,
      routeFamily: null,
      difficulty: AssessmentDifficulty.INTERMEDIATE,
      language: 'en',
      questionType: AssessmentQuestionType.MULTIPLE_CHOICE,
      prompt:
        '[DEMO THEORY PRE-SCREEN ONLY] A traveler is unresponsive. Which response is the safest research pre-screen answer?',
      responseOptions: [
        'A. Check immediate danger, call qualified emergency help, and follow current approved training.',
        'B. Delay escalation until the group decides what happened.',
        'C. Continue the route and check again at the next stop.',
        'D. Claim practical competence because this theory question was passed.',
      ],
      answerKey: {
        correctOption: 'A',
        verificationStatus: 'PLACEHOLDER_REQUIRES_MEDICAL_EXPERT_SOURCE',
      },
      sourceId: sourceIds['assessment-demo'],
    },
    {
      id: questionIds.history,
      category: AssessmentCategory.HISTORY_ARCHAEOLOGY,
      routeFamily: null,
      difficulty: AssessmentDifficulty.BASIC,
      language: 'en',
      questionType: AssessmentQuestionType.MULTIPLE_CHOICE,
      prompt: '[DEMO] A heritage date in your notes conflicts with a newer authoritative source. What should you do?',
      responseOptions: ['A. Re-verify and cite the current authoritative source.', 'B. Use the older date because it is familiar.', 'C. Invent a compromise date.', 'D. Omit uncertainty and present both as facts.'],
      answerKey: { correctOption: 'A', verificationStatus: 'DEMO_REQUIRES_EXPERT_REVIEW' },
      sourceId: sourceIds['unesco-orkhon'],
    },
    {
      id: questionIds.culture,
      category: AssessmentCategory.RELIGION_CULTURE,
      routeFamily: null,
      difficulty: AssessmentDifficulty.BASIC,
      language: 'en',
      questionType: AssessmentQuestionType.MULTIPLE_CHOICE,
      prompt: '[DEMO] Site etiquette may have changed. Which briefing is appropriate?',
      responseOptions: ['A. Confirm current site rules and explain them respectfully.', 'B. Assume every site follows the same rules.', 'C. Let visitors ignore local instructions.', 'D. Present a personal preference as law.'],
      answerKey: { correctOption: 'A', verificationStatus: 'DEMO_REQUIRES_EXPERT_REVIEW' },
      sourceId: sourceIds['unesco-orkhon'],
    },
    {
      id: questionIds.geography,
      category: AssessmentCategory.GEOGRAPHY_NATURE,
      routeFamily: null,
      difficulty: AssessmentDifficulty.BASIC,
      language: 'en',
      questionType: AssessmentQuestionType.MULTIPLE_CHOICE,
      prompt: '[DEMO] A route description contains no current road or weather observation. What is the correct claim?',
      responseOptions: ['A. It is background context; current conditions still require a live check.', 'B. It proves the road is open today.', 'C. It replaces an emergency plan.', 'D. It guarantees a fixed travel time.'],
      answerKey: { correctOption: 'A', verificationStatus: 'DEMO_REQUIRES_EXPERT_REVIEW' },
      sourceId: sourceIds.khuvsgul,
    },
    {
      id: questionIds.society,
      category: AssessmentCategory.SOCIETY_ECONOMY,
      routeFamily: null,
      difficulty: AssessmentDifficulty.BASIC,
      language: 'en',
      questionType: AssessmentQuestionType.MULTIPLE_CHOICE,
      prompt: '[DEMO] How should a guide describe a suggested local purchase?',
      responseOptions: ['A. As an optional recommendation with transparent commercial context.', 'B. As a mandatory government fee.', 'C. As a verified legal obligation without a source.', 'D. Hide any commission or relationship.'],
      answerKey: { correctOption: 'A', verificationStatus: 'DEMO_REQUIRES_EXPERT_REVIEW' },
      sourceId: sourceIds['assessment-demo'],
    },
    {
      id: questionIds.languageDestination,
      category: AssessmentCategory.LANGUAGE,
      routeFamily: null,
      difficulty: AssessmentDifficulty.INTERMEDIATE,
      language: 'en',
      questionType: AssessmentQuestionType.SPEAKING_TASK,
      prompt: '[DEMO AI LANGUAGE ESTIMATE ONLY] Explain Kharkhorin to first-time English-speaking visitors and distinguish sourced facts from interpretation.',
      answerKey: { expectedBehaviors: ['structured destination explanation', 'source-aware wording'], verificationStatus: 'DEMO_AI_ESTIMATE_NOT_OFFICIAL_CEFR' },
      sourceId: sourceIds['assessment-demo'],
    },
    {
      id: questionIds.languageQuestions,
      category: AssessmentCategory.LANGUAGE,
      routeFamily: null,
      difficulty: AssessmentDifficulty.INTERMEDIATE,
      language: 'en',
      questionType: AssessmentQuestionType.SPEAKING_TASK,
      prompt: '[DEMO AI LANGUAGE ESTIMATE ONLY] Respond to two spontaneous visitor questions about an uncertain route condition.',
      answerKey: { expectedBehaviors: ['interaction', 'transparent uncertainty'], verificationStatus: 'DEMO_AI_ESTIMATE_NOT_OFFICIAL_CEFR' },
      sourceId: sourceIds['assessment-demo'],
    },
    {
      id: questionIds.languageSimplify,
      category: AssessmentCategory.LANGUAGE,
      routeFamily: null,
      difficulty: AssessmentDifficulty.INTERMEDIATE,
      language: 'en',
      questionType: AssessmentQuestionType.SPEAKING_TASK,
      prompt: '[DEMO AI LANGUAGE ESTIMATE ONLY] A visitor did not understand. Repeat your explanation using simpler English.',
      answerKey: { expectedBehaviors: ['simplification', 'clarity'], verificationStatus: 'DEMO_AI_ESTIMATE_NOT_OFFICIAL_CEFR' },
      sourceId: sourceIds['assessment-demo'],
    },
    {
      id: questionIds.languageEmergency,
      category: AssessmentCategory.LANGUAGE,
      routeFamily: null,
      difficulty: AssessmentDifficulty.ADVANCED,
      language: 'en',
      questionType: AssessmentQuestionType.SPEAKING_TASK,
      prompt: '[DEMO AI LANGUAGE ESTIMATE ONLY] Explain to an injured visitor what you are doing and how qualified help will be requested.',
      answerKey: { expectedBehaviors: ['clear emergency communication', 'no unsupported medical claim'], verificationStatus: 'DEMO_AI_ESTIMATE_NOT_OFFICIAL_CEFR' },
      sourceId: sourceIds['assessment-demo'],
    },
    {
      id: questionIds.guideSkill,
      category: AssessmentCategory.GUIDE_SKILL,
      routeFamily: null,
      difficulty: AssessmentDifficulty.INTERMEDIATE,
      language: 'en',
      questionType: AssessmentQuestionType.SCENARIO,
      prompt: '[DEMO GUIDE PRE-SCREEN] You are guiding 15 visitors at a heritage site. Give a short safety briefing and a source-aware introduction.',
      answerKey: { expectedBehaviors: ['information structure', 'group awareness', 'clarity', 'professionalism', 'safety awareness'], verificationStatus: 'DEMO_REQUIRES_EXPERT_REVIEW' },
      sourceId: sourceIds['assessment-demo'],
    },
    {
      id: questionIds.firstAidScenario,
      category: AssessmentCategory.FIRST_AID_THEORY,
      routeFamily: null,
      difficulty: AssessmentDifficulty.ADVANCED,
      language: 'en',
      questionType: AssessmentQuestionType.SCENARIO,
      prompt: '[DEMO THEORY PRE-SCREEN ONLY] A visitor may have severe bleeding. Describe danger recognition, escalation, communication, and unsafe actions to avoid.',
      answerKey: { expectedBehaviors: ['urgent escalation', 'follow approved current training', 'clear communication'], unsafeBehaviors: ['delay', 'claim practical verification'], verificationStatus: 'PLACEHOLDER_REQUIRES_MEDICAL_EXPERT_SOURCE' },
      sourceId: sourceIds['assessment-demo'],
    },
  ];

  for (const question of questions) {
    const data = {
      category: question.category,
      routeFamily: question.routeFamily,
      difficulty: question.difficulty,
      language: question.language,
      questionType: question.questionType,
      prompt: question.prompt,
      responseOptions: question.responseOptions,
      answerKey: question.answerKey,
      scoringRubric: demoRubric,
      active: true,
      sourceId: question.sourceId,
    };
    await prisma.assessmentQuestion.upsert({
      where: { id: question.id },
      update: data,
      create: { id: question.id, ...data },
    });
  }

  return {
    sources: ROUTE_GRAPH.sources.length + 1,
    routes: ROUTE_GRAPH.routes.length,
    nodes: nodeIds.size,
    edges: ROUTE_GRAPH.edges.length,
    knowledge: knowledgeCount,
    questions: questions.length,
    status: 'PROTOTYPE_DEMO_NOT_VERIFIED',
  };
}
