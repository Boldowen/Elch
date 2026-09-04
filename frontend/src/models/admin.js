const asArray = (value) => (Array.isArray(value) ? value : []);

function optionalString(value) {
  return value === null || value === undefined || value === '' ? null : String(value);
}

export function mapTourismSource(json = {}) {
  const counts = json._count && typeof json._count === 'object' ? json._count : {};
  return {
    id: String(json.id ?? ''),
    title: String(json.title ?? ''),
    organization: String(json.organization ?? ''),
    sourceType: String(json.sourceType ?? 'OTHER'),
    authorityLevel: String(json.authorityLevel ?? 'OTHER'),
    url: String(json.url ?? ''),
    language: String(json.language ?? 'en'),
    publishedAt: optionalString(json.publishedAt),
    validFrom: optionalString(json.validFrom),
    validTo: optionalString(json.validTo),
    licenseOrUsageNote: String(json.licenseOrUsageNote ?? ''),
    reviewStatus: String(json.reviewStatus ?? 'PENDING'),
    reviewedAt: optionalString(json.reviewedAt),
    reviewedById: optionalString(json.reviewedById),
    reviewNotes: optionalString(json.reviewNotes),
    lastVerifiedAt: optionalString(json.lastVerifiedAt),
    createdAt: optionalString(json.createdAt),
    updatedAt: optionalString(json.updatedAt),
    counts: {
      knowledge: Number(counts.knowledge) || 0,
      routes: Number(counts.routes) || 0,
      routeNodes: Number(counts.routeNodes) || 0,
      routeEdges: Number(counts.routeEdges) || 0,
      assessmentQuestions: Number(counts.assessmentQuestions) || 0,
    },
    knowledge: asArray(json.knowledge).map(mapTourismKnowledge),
  };
}

export function mapTourismKnowledge(json = {}) {
  return {
    id: String(json.id ?? ''),
    sourceId: String(json.sourceId ?? ''),
    title: String(json.title ?? ''),
    contentHash: String(json.contentHash ?? ''),
    chunkIndex: Number(json.chunkIndex) || 0,
    region: optionalString(json.region),
    routeFamily: optionalString(json.routeFamily),
    category: String(json.category ?? ''),
    language: String(json.language ?? ''),
    tokenCount: Number(json.tokenCount) || 0,
    active: Boolean(json.active),
    lastVerifiedAt: optionalString(json.lastVerifiedAt),
    createdAt: optionalString(json.createdAt),
    updatedAt: optionalString(json.updatedAt),
  };
}

export function mapIngestionResult(json = {}) {
  return {
    sourceId: String(json.sourceId ?? ''),
    chunks: Number.isFinite(Number(json.chunks)) ? Number(json.chunks) : 0,
    records: asArray(json.records).map((record) => ({
      id: String(record?.id ?? ''),
      chunkIndex: Number.isFinite(Number(record?.chunkIndex)) ? Number(record.chunkIndex) : 0,
      contentHash: String(record?.contentHash ?? ''),
    })),
  };
}

function mapBlindQuestion(json = {}) {
  return {
    id: String(json.id ?? ''),
    category: String(json.category ?? ''),
    routeFamily: optionalString(json.routeFamily),
    difficulty: String(json.difficulty ?? ''),
    language: String(json.language ?? ''),
    questionType: String(json.questionType ?? ''),
    prompt: String(json.prompt ?? ''),
    responseOptions: asArray(json.responseOptions).map(String),
  };
}

function mapBlindResponse(json = {}) {
  return {
    id: String(json.id ?? ''),
    responseText: optionalString(json.responseText),
    responsePayload: json.responsePayload && typeof json.responsePayload === 'object'
      ? json.responsePayload
      : null,
    audioReference: optionalString(json.audioReference),
    question: mapBlindQuestion(json.question),
  };
}

export function mapBlindAssessment(json = {}) {
  // Deliberately omit guide identity and AI scores, even if a server regression
  // accidentally includes them in a blind-review response.
  return {
    id: String(json.id ?? ''),
    assessmentType: String(json.assessmentType ?? ''),
    routeFamily: optionalString(json.routeFamily),
    language: optionalString(json.language),
    submittedAt: optionalString(json.submittedAt),
    responses: asArray(json.responses).map(mapBlindResponse),
  };
}

export function mapAssessmentReview(json = {}) {
  return {
    id: String(json.id ?? ''),
    decision: String(json.decision ?? ''),
    humanScore: json.humanScore === null || json.humanScore === undefined
      ? null
      : Number(json.humanScore),
    humanPassed: typeof json.humanPassed === 'boolean' ? json.humanPassed : null,
    humanCefr: optionalString(json.humanCefr),
    reviewedAt: optionalString(json.reviewedAt),
  };
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

function mapAdminRouteNode(json = {}) {
  const code = String(json.code ?? json.id ?? '');
  const candidateDatabaseId = json.databaseId ?? json.nodeId ?? json.recordId;
  return {
    databaseId: isUuid(candidateDatabaseId) ? String(candidateDatabaseId) : null,
    code,
    nameMn: String(json.nameMn ?? json.name ?? ''),
    nameEn: String(json.nameEn ?? json.name ?? ''),
    region: String(json.region ?? ''),
    latitude: finiteNumber(json.latitude),
    longitude: finiteNumber(json.longitude),
    altitude: json.altitude === null || json.altitude === undefined
      ? (json.elevationMeters === null || json.elevationMeters === undefined ? null : finiteNumber(json.elevationMeters))
      : finiteNumber(json.altitude),
    nodeType: String(json.nodeType ?? json.type ?? 'OTHER'),
    sequenceHint: json.sequenceHint === null || json.sequenceHint === undefined
      ? null
      : finiteNumber(json.sequenceHint),
    minimumVisitMinutes: json.minimumVisitMinutes === null || json.minimumVisitMinutes === undefined
      ? null
      : finiteNumber(json.minimumVisitMinutes),
    sourceId: optionalString(json.sourceId),
    active: json.active === undefined ? true : Boolean(json.active),
  };
}

function mapAdminRouteEdge(json = {}) {
  const code = String(json.code ?? json.id ?? '');
  const candidateDatabaseId = json.databaseId ?? json.edgeId ?? json.recordId;
  return {
    databaseId: isUuid(candidateDatabaseId) ? String(candidateDatabaseId) : null,
    code,
    from: String(json.from ?? json.fromNode?.code ?? ''),
    to: String(json.to ?? json.toNode?.code ?? ''),
    fromNodeId: isUuid(json.fromNodeId) ? String(json.fromNodeId) : null,
    toNodeId: isUuid(json.toNodeId) ? String(json.toNodeId) : null,
    transportMode: String(json.transportMode ?? json.mode ?? 'ROAD'),
    distanceKm: finiteNumber(json.distanceKm),
    estimatedTravelMinutes: finiteNumber(json.estimatedTravelMinutes ?? json.nominalMinutes),
    estimatedCostMinor: json.estimatedCostMinor === null || json.estimatedCostMinor === undefined
      ? null
      : finiteNumber(json.estimatedCostMinor),
    estimatedCostCurrency: optionalString(json.estimatedCostCurrency),
    terrain: optionalString(json.terrain),
    riskLevel: String(json.riskLevel ?? json.riskClass ?? 'R0'),
    openMonths: asArray(json.openMonths).map(Number).filter((month) => Number.isInteger(month) && month >= 1 && month <= 12),
    sourceId: optionalString(json.sourceId),
    bidirectional: Boolean(json.bidirectional),
    requiresRoadCheck: Boolean(json.requiresRoadCheck),
    requiresWeatherCheck: Boolean(json.requiresWeatherCheck),
    requiresPermitCheck: Boolean(json.requiresPermitCheck),
    requiresGuide: Boolean(json.requiresGuide),
    requiredGuideCompetencies: asArray(json.requiredGuideCompetencies ?? json.requiredSkills).map(String),
    emergencyPlanRequired: Boolean(json.emergencyPlanRequired),
    active: json.active === undefined ? true : Boolean(json.active),
    lastVerifiedAt: optionalString(json.lastVerifiedAt),
  };
}

export function mapAdminRoute(json = {}) {
  const recommendedDays = json.recommendedDays && typeof json.recommendedDays === 'object'
    ? json.recommendedDays
    : {};
  const candidateDatabaseId = json.databaseId ?? json.routeId;
  return {
    databaseId: isUuid(candidateDatabaseId) ? String(candidateDatabaseId) : null,
    code: String(json.code ?? json.id ?? ''),
    name: String(json.name ?? ''),
    routeFamily: String(json.routeFamily ?? 'CENTRAL_HERITAGE'),
    description: String(json.description ?? ''),
    minimumDays: finiteNumber(json.minimumDays ?? recommendedDays.min, 1),
    recommendedDays: finiteNumber(json.recommendedDays && typeof json.recommendedDays !== 'object' ? json.recommendedDays : recommendedDays.max, 1),
    riskLevel: String(json.riskLevel ?? json.riskClass ?? 'R0'),
    minimumLanguageLevel: String(json.minimumLanguageLevel ?? json.guideRequirements?.minimumLanguageLevel ?? 'B1'),
    routeBadge: String(json.routeBadge ?? json.guideRequirements?.routeBadge ?? ''),
    firstAidRequired: Boolean(json.firstAidRequired ?? json.guideRequirements?.firstAidRequired),
    requiredGuideLegalRole: String(json.requiredGuideLegalRole ?? json.guideRequirements?.legalRole ?? 'UNVERIFIED'),
    requiredSpecialtySkills: asArray(json.requiredSpecialtySkills ?? json.guideRequirements?.specialtySkills).map(String),
    sourceId: optionalString(json.sourceId),
    active: json.active === undefined ? true : Boolean(json.active),
    updatedAt: optionalString(json.updatedAt),
    nodes: asArray(json.nodes ?? json.pois).map(mapAdminRouteNode),
    edges: asArray(json.edges).map(mapAdminRouteEdge),
  };
}

function mapSafetyAudit(json = {}) {
  // The immutable server snapshot can contain full emergency contact details.
  // The mobile timeline only needs the decision metadata, so omit the snapshot.
  return {
    id: String(json.id ?? ''),
    action: String(json.action ?? ''),
    fromStatus: optionalString(json.fromStatus),
    toStatus: String(json.toStatus ?? ''),
    planVersion: finiteNumber(json.planVersion),
    reason: optionalString(json.reason),
    createdAt: optionalString(json.createdAt),
    actor: json.actor && typeof json.actor === 'object'
      ? { id: String(json.actor.id ?? ''), name: String(json.actor.name ?? '') }
      : null,
  };
}

export function mapSafetyPlan(json = {}) {
  return {
    id: String(json.id ?? ''),
    title: String(json.title ?? ''),
    status: String(json.status ?? 'DRAFT'),
    version: finiteNumber(json.version, 1),
    tripStartAt: optionalString(json.tripStartAt),
    tripEndAt: optionalString(json.tripEndAt),
    riskLevel: String(json.riskLevelSnapshot ?? json.route?.riskLevel ?? 'R0'),
    itinerary: asArray(json.itinerary).map((item) => ({
      day: finiteNumber(item?.day),
      nodeCode: String(item?.nodeCode ?? ''),
      activity: String(item?.activity ?? ''),
    })),
    emergencyContacts: asArray(json.emergencyContacts).map((item) => ({
      name: String(item?.name ?? ''),
      role: String(item?.role ?? ''),
      phone: String(item?.phone ?? ''),
    })),
    communicationsPlan: String(json.communicationsPlan ?? ''),
    evacuationPlan: String(json.evacuationPlan ?? ''),
    medicalPlan: String(json.medicalPlan ?? ''),
    riskMitigations: asArray(json.riskMitigations).map(String),
    equipmentChecklist: asArray(json.equipmentChecklist).map(String),
    permitReferences: asArray(json.permitReferences).map(String),
    submittedAt: optionalString(json.submittedAt),
    approvedAt: optionalString(json.approvedAt),
    rejectedAt: optionalString(json.rejectedAt),
    revokedAt: optionalString(json.revokedAt),
    expiresAt: optionalString(json.expiresAt),
    reviewNotes: optionalString(json.reviewNotes),
    route: json.route && typeof json.route === 'object'
      ? {
          id: String(json.route.id ?? ''),
          code: String(json.route.code ?? ''),
          name: String(json.route.name ?? ''),
          riskLevel: String(json.route.riskLevel ?? 'R0'),
          active: Boolean(json.route.active),
        }
      : null,
    guide: json.guideProfile && typeof json.guideProfile === 'object'
      ? {
          id: String(json.guideProfile.id ?? ''),
          name: String(json.guideProfile.user?.name ?? ''),
          status: String(json.guideProfile.status ?? ''),
          verified: Boolean(json.guideProfile.verified),
        }
      : null,
    creator: json.createdBy && typeof json.createdBy === 'object'
      ? { id: String(json.createdBy.id ?? ''), name: String(json.createdBy.name ?? '') }
      : null,
    reviewer: json.reviewedBy && typeof json.reviewedBy === 'object'
      ? { id: String(json.reviewedBy.id ?? ''), name: String(json.reviewedBy.name ?? '') }
      : null,
    audit: asArray(json.auditEntries).map(mapSafetyAudit),
  };
}

export function mapGuideEvidence(json = {}) {
  const publicMetadata = json.metadata && typeof json.metadata === 'object' && !Array.isArray(json.metadata)
    ? json.metadata
    : {};
  // Explicit allow-list: storageKey, sha256, reference and reviewer IDs are
  // intentionally discarded and can never reach the UI model.
  return {
    id: String(json.id ?? ''),
    type: String(json.type ?? ''),
    issuer: String(json.issuer ?? ''),
    status: String(json.status ?? 'PENDING'),
    verifiedAt: optionalString(json.verifiedAt),
    expiresAt: optionalString(json.expiresAt),
    createdAt: optionalString(json.createdAt),
    updatedAt: optionalString(json.updatedAt),
    file: {
      name: String(publicMetadata.originalName ?? ''),
      mimeType: String(publicMetadata.mimeType ?? ''),
      size: finiteNumber(publicMetadata.size),
      reviewNote: optionalString(publicMetadata.reviewNote),
      reviewedAt: optionalString(publicMetadata.reviewedAt),
    },
    guide: json.guideProfile && typeof json.guideProfile === 'object'
      ? {
          id: String(json.guideProfile.id ?? ''),
          userId: String(json.guideProfile.user?.id ?? ''),
          name: String(json.guideProfile.user?.name ?? ''),
          email: String(json.guideProfile.user?.email ?? ''),
        }
      : null,
  };
}
