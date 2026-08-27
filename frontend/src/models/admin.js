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
