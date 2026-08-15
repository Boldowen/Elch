const asArray = (value) => (Array.isArray(value) ? value : []);

function optionalNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function mapSafeOption(option, index) {
  if (option && typeof option === 'object') {
    return {
      value: String(option.value ?? option.id ?? option.key ?? index + 1),
      label: String(option.label ?? option.text ?? option.value ?? option.id ?? index + 1),
    };
  }
  return { value: String(option), label: String(option) };
}

export function mapAssessmentQuestion(json = {}) {
  const rawOptions = asArray(json.options ?? json.responseOptions);
  // Intentionally copy only fields that are safe for an assessment taker.
  // answerKey and scoringRubric are never retained even if a server regresses.
  return {
    id: String(json.id ?? ''),
    category: String(json.category ?? ''),
    routeFamily: json.routeFamily ? String(json.routeFamily) : null,
    difficulty: String(json.difficulty ?? ''),
    language: String(json.language ?? ''),
    questionType: String(json.questionType ?? 'SHORT_ANSWER'),
    prompt: String(json.prompt ?? ''),
    options: rawOptions.map(mapSafeOption),
  };
}

export function mapAssessmentResponse(json = {}) {
  return {
    id: json.id ? String(json.id) : null,
    questionId: String(json.questionId ?? ''),
    responseText: json.responseText === null || json.responseText === undefined
      ? ''
      : String(json.responseText),
    responsePayload: json.responsePayload && typeof json.responsePayload === 'object'
      ? json.responsePayload
      : null,
    audioReference: json.audioReference ? String(json.audioReference) : null,
    createdAt: json.createdAt ? String(json.createdAt) : null,
    updatedAt: json.updatedAt ? String(json.updatedAt) : null,
  };
}

export function mapAssessmentAttempt(json = {}) {
  return {
    id: String(json.id ?? ''),
    assessmentType: String(json.assessmentType ?? ''),
    routeFamily: json.routeFamily ? String(json.routeFamily) : null,
    language: json.language ? String(json.language) : null,
    status: String(json.status ?? 'NOT_STARTED'),
    score: optionalNumber(json.score),
    aiScore: optionalNumber(json.aiScore),
    humanScore: optionalNumber(json.humanScore),
    passed: typeof json.passed === 'boolean' ? json.passed : null,
    humanPassed: typeof json.humanPassed === 'boolean' ? json.humanPassed : null,
    aiEstimatedCefr: json.aiEstimatedCefr ? String(json.aiEstimatedCefr) : null,
    humanCefr: json.humanCefr ? String(json.humanCefr) : null,
    aiConfidence: optionalNumber(json.aiConfidence),
    startedAt: json.startedAt ? String(json.startedAt) : null,
    submittedAt: json.submittedAt ? String(json.submittedAt) : null,
    completedAt: json.completedAt ? String(json.completedAt) : null,
    createdAt: json.createdAt ? String(json.createdAt) : null,
    questions: asArray(json.questions).map(mapAssessmentQuestion),
    responses: asArray(json.responses).map(mapAssessmentResponse),
    label: json.label ? String(json.label) : null,
    requiresHumanReview: Boolean(json.requiresHumanReview),
  };
}

export function mapAssessmentDashboard(json = {}) {
  const language = json.languageEstimate && typeof json.languageEstimate === 'object'
    ? json.languageEstimate
    : null;
  const firstAid = json.firstAid && typeof json.firstAid === 'object' ? json.firstAid : null;
  return {
    label: String(json.label ?? 'Platform research pre-screening'),
    guideId: String(json.guideId ?? ''),
    attempts: asArray(json.attempts).map(mapAssessmentAttempt),
    languageEstimate: language ? {
      language: String(language.language ?? ''),
      aiEstimatedCefr: language.aiEstimatedCefr ? String(language.aiEstimatedCefr) : null,
      aiConfidence: optionalNumber(language.aiConfidence),
      humanVerifiedCefr: language.humanVerifiedCefr ? String(language.humanVerifiedCefr) : null,
      assessmentStatus: String(language.assessmentStatus ?? ''),
      createdAt: language.createdAt ? String(language.createdAt) : null,
    } : null,
    routeCompetencies: asArray(json.routeCompetencies).map((item) => ({
      routeFamily: String(item.routeFamily ?? ''),
      score: optionalNumber(item.score),
      status: String(item.status ?? ''),
      passedAt: item.passedAt ? String(item.passedAt) : null,
      expiresAt: item.expiresAt ? String(item.expiresAt) : null,
    })),
    firstAid: firstAid ? {
      certificateStatus: String(firstAid.certificateStatus ?? ''),
      theoryScore: optionalNumber(firstAid.theoryScore),
      practicalVerificationStatus: String(firstAid.practicalVerificationStatus ?? 'NOT_ASSESSED'),
      expiresAt: firstAid.expiresAt ? String(firstAid.expiresAt) : null,
    } : null,
  };
}

export function mapLanguageEstimate(json = {}) {
  const scores = json.scores && typeof json.scores === 'object' ? json.scores : {};
  return {
    label: String(json.label ?? 'AI Language Estimate — not an official CEFR certificate'),
    estimatedCefr: json.estimatedCefr ? String(json.estimatedCefr) : null,
    confidence: optionalNumber(json.confidence),
    scores: {
      fluency: optionalNumber(scores.fluency),
      grammar: optionalNumber(scores.grammar),
      vocabulary: optionalNumber(scores.vocabulary),
      interaction: optionalNumber(scores.interaction),
      clarity: optionalNumber(scores.clarity),
    },
    unsafeActions: asArray(json.unsafeActions).map(String),
    feedback: Array.isArray(json.feedback)
      ? json.feedback.map(String)
      : json.feedback ? [String(json.feedback)] : [],
    humanVerificationRequired: Boolean(json.humanVerificationRequired),
  };
}
