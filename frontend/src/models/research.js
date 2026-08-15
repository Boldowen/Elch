const asArray = (value) => (Array.isArray(value) ? value : []);

export function mapResearchRoute(json = {}) {
  const recommendedDays = json.recommendedDays || {};
  return {
    id: String(json.id ?? ''),
    name: String(json.name ?? ''),
    description: String(json.description ?? ''),
    riskClass: String(json.riskClass ?? 'R0'),
    recommendedDays: {
      min: Number(recommendedDays.min) || 0,
      max: Number(recommendedDays.max) || 0,
    },
    poiIds: asArray(json.poiIds).map(String),
    pois: asArray(json.pois).filter(Boolean).map((poi) => ({
      id: String(poi.id ?? ''),
      nameMn: String(poi.nameMn ?? poi.nameEn ?? ''),
      nameEn: String(poi.nameEn ?? poi.nameMn ?? ''),
      region: String(poi.region ?? ''),
      type: String(poi.type ?? ''),
      sourceId: poi.sourceId ? String(poi.sourceId) : null,
    })),
    edges: asArray(json.edges).filter(Boolean).map((edge) => ({
      id: String(edge.id ?? ''),
      from: String(edge.from ?? ''),
      to: String(edge.to ?? ''),
      mode: String(edge.mode ?? 'ROAD'),
      distanceKm: Number(edge.distanceKm) || 0,
      nominalMinutes: Number(edge.nominalMinutes) || 0,
      openMonths: asArray(edge.openMonths).map(Number).filter(Number.isFinite),
      riskClass: String(edge.riskClass ?? 'R0'),
      requiredSkills: asArray(edge.requiredSkills).map(String),
      estimatedCostMinor: Number(edge.estimatedCostMinor) || 0,
      sourceId: edge.sourceId ? String(edge.sourceId) : null,
    })),
    sources: asArray(json.sources).filter(Boolean).map(mapTourismSource),
    guideRequirements: json.guideRequirements && typeof json.guideRequirements === 'object'
      ? {
          minimumLanguageLevel: String(json.guideRequirements.minimumLanguageLevel ?? ''),
          routeBadge: String(json.guideRequirements.routeBadge ?? ''),
          firstAidRequired: Boolean(json.guideRequirements.firstAidRequired),
          legalRole: String(json.guideRequirements.legalRole ?? ''),
          specialtySkills: asArray(json.guideRequirements.specialtySkills).map(String),
        }
      : null,
    disclaimer: String(json.disclaimer ?? ''),
  };
}

export function mapTourismSource(json = {}) {
  return {
    sourceId: String(json.sourceId ?? json.id ?? ''),
    title: String(json.title ?? 'Source'),
    url: json.url ? String(json.url) : null,
    authorityTier: Number(json.authorityTier ?? json.authority) || null,
    lastVerifiedAt: json.lastVerifiedAt ? String(json.lastVerifiedAt) : null,
  };
}

export function mapAssistantResponse(json = {}) {
  const fallback = 'Verified information is unavailable.';
  return {
    answer: String(json.answer || fallback),
    intent: String(json.intent ?? 'GENERAL_TRAVEL'),
    confidence: Number.isFinite(Number(json.confidence))
      ? Math.max(0, Math.min(1, Number(json.confidence)))
      : null,
    route: json.route && typeof json.route === 'object'
      ? {
          id: String(json.route.id ?? ''),
          name: String(json.route.name ?? ''),
          riskClass: String(json.route.riskClass ?? 'R0'),
          recommendedDays: json.route.recommendedDays || null,
          poiIds: asArray(json.route.poiIds).map(String),
        }
      : null,
    verifiedFacts: asArray(json.verifiedFacts).map(String),
    recommendations: asArray(json.recommendations).map(String),
    warnings: asArray(json.warnings).map((warning) =>
      typeof warning === 'string' ? warning : String(warning?.message ?? warning?.code ?? ''),
    ).filter(Boolean),
    limitations: asArray(json.limitations).map(String),
    citations: asArray(json.citations ?? json.sources).filter(Boolean).map(mapTourismSource),
    suggestedTools: asArray(json.suggestedTools).map(String),
    guideMatches: asArray(json.guideMatches),
    routeValidation: json.routeValidation && typeof json.routeValidation === 'object'
      ? json.routeValidation
      : null,
    itinerary: asArray(json.itinerary),
    requiresClarification: Boolean(json.requiresClarification),
    requiresHumanEscalation: Boolean(json.requiresHumanEscalation),
  };
}

export function mapRouteValidation(json = {}) {
  const summary = json.summary || {};
  return {
    valid: Boolean(json.valid),
    routeId: String(json.routeId ?? ''),
    summary: {
      distanceKm: Number(summary.distanceKm) || 0,
      travelMinutes: Number(summary.travelMinutes) || 0,
      estimatedCostMinor: Number(summary.estimatedCostMinor) || 0,
      highestRisk: String(summary.highestRisk ?? 'R0'),
      days: Number(summary.days) || 0,
    },
    issues: asArray(json.issues).filter(Boolean).map((issue) => ({
      rule: String(issue.rule ?? 'VALIDATION'),
      severity: String(issue.severity ?? 'WARNING'),
      message: String(issue.message ?? ''),
    })),
    disclaimer: String(json.disclaimer ?? ''),
    validatedAt: json.validatedAt ? String(json.validatedAt) : null,
  };
}

export function mapGuideMatchResult(json = {}) {
  return {
    routeId: String(json.routeId ?? ''),
    policy: String(json.policy ?? ''),
    eligible: asArray(json.eligible),
    rejected: asArray(json.rejected),
  };
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function numeric(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function mapResearchDistribution(value) {
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (item === null || item === undefined) return null;
      if (typeof item !== 'object') return { label: String(item), count: 1 };
      const label = firstDefined(
        item.label,
        item.name,
        item.key,
        item.mode,
        item.model,
        item.code,
        item.status,
        item.level,
        item.routeFamily,
        item.error,
        item.category,
        `Item ${index + 1}`,
      );
      return {
        label: String(label),
        count: numeric(firstDefined(item.count, item.value, item.total, item.requests, item.assessments)),
      };
    }).filter(Boolean);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).map(([label, count]) => ({ label, count: numeric(count) }));
  }
  return [];
}

export function mapResearchSummary(json = {}) {
  const nested = json.summary && typeof json.summary === 'object' ? json.summary : {};
  const data = { ...json, ...nested };
  const costValue = firstDefined(data.estimatedAiCost, data.estimatedCost, data.totalEstimatedCost, 0);
  const costObject = costValue && typeof costValue === 'object' ? costValue : null;
  const comparison = firstDefined(data.aiVsHumanScoreComparison, data.aiHumanComparison, data.scoreComparison, {});
  return {
    totalAiRequests: numeric(firstDefined(data.totalAiRequests, data.aiRequestCount, data.totalRequests)),
    experimentModes: mapResearchDistribution(firstDefined(data.experimentModeDistribution, data.experimentModes, data.modeDistribution)),
    modelUsage: mapResearchDistribution(firstDefined(data.modelUsage, data.modelDistribution)),
    estimatedAiCost: numeric(costObject ? firstDefined(costObject.amount, costObject.total, costObject.value) : costValue),
    currency: String(firstDefined(costObject?.currency, data.currency, 'USD')),
    routeValidationFailures: numeric(firstDefined(data.routeValidationFailures, data.validatorFailureCount, data.validationFailures)),
    commonValidationErrors: mapResearchDistribution(firstDefined(data.commonValidationErrors, data.validationErrorDistribution, data.validatorErrors)),
    guideAssessmentCount: numeric(firstDefined(data.guideAssessmentCount, data.totalGuideAssessments, data.assessmentCount)),
    aiHumanComparison: {
      aiAverage: numeric(firstDefined(comparison?.aiAverage, comparison?.aiMean, comparison?.averageAiScore), null),
      humanAverage: numeric(firstDefined(comparison?.humanAverage, comparison?.humanMean, comparison?.averageHumanScore), null),
      correlation: numeric(firstDefined(comparison?.correlation, comparison?.correlationCoefficient), null),
      sampleSize: numeric(firstDefined(comparison?.sampleSize, comparison?.count, comparison?.pairedCount)),
    },
    routeCompetencies: mapResearchDistribution(firstDefined(data.routeCompetencyDistribution, data.routeCompetencies)),
    languageEstimates: mapResearchDistribution(firstDefined(data.languageEstimateDistribution, data.languageEstimates, data.cefrDistribution)),
    firstAidVerification: mapResearchDistribution(firstDefined(data.firstAidVerificationDistribution, data.firstAidDistribution)),
    generatedAt: firstDefined(data.generatedAt, data.updatedAt, data.asOf)
      ? String(firstDefined(data.generatedAt, data.updatedAt, data.asOf))
      : null,
  };
}

export function researchSummaryHasData(summary) {
  if (!summary) return false;
  return summary.totalAiRequests > 0 ||
    summary.estimatedAiCost > 0 ||
    summary.routeValidationFailures > 0 ||
    summary.guideAssessmentCount > 0 ||
    summary.experimentModes.length > 0 ||
    summary.modelUsage.length > 0 ||
    summary.commonValidationErrors.length > 0 ||
    summary.routeCompetencies.length > 0 ||
    summary.languageEstimates.length > 0 ||
    summary.firstAidVerification.length > 0 ||
    summary.aiHumanComparison.sampleSize > 0;
}
