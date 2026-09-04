import * as runtime from "@prisma/client/runtime/index-browser";
export const Decimal = runtime.Decimal;
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    User: 'User',
    RefreshToken: 'RefreshToken',
    EmailVerificationToken: 'EmailVerificationToken',
    PasswordResetToken: 'PasswordResetToken',
    GuideProfile: 'GuideProfile',
    GuideEvidence: 'GuideEvidence',
    CompetencyAttempt: 'CompetencyAttempt',
    TourismSource: 'TourismSource',
    TourismKnowledge: 'TourismKnowledge',
    ResearchRoute: 'ResearchRoute',
    RouteNode: 'RouteNode',
    RouteEdge: 'RouteEdge',
    SafetyPlan: 'SafetyPlan',
    SafetyPlanAudit: 'SafetyPlanAudit',
    GuideCompetency: 'GuideCompetency',
    GuideLanguageAssessment: 'GuideLanguageAssessment',
    GuideKnowledgeAssessment: 'GuideKnowledgeAssessment',
    GuideSkillAssessment: 'GuideSkillAssessment',
    GuideRouteCompetency: 'GuideRouteCompetency',
    GuideFirstAid: 'GuideFirstAid',
    AssessmentQuestion: 'AssessmentQuestion',
    AssessmentAttempt: 'AssessmentAttempt',
    AssessmentResponse: 'AssessmentResponse',
    AssessmentReview: 'AssessmentReview',
    AiConversation: 'AiConversation',
    AiMessage: 'AiMessage',
    AiExperimentRun: 'AiExperimentRun',
    AiEvaluationResult: 'AiEvaluationResult',
    GuideMatchRun: 'GuideMatchRun',
    GuideMatchResult: 'GuideMatchResult',
    GuideVerificationReview: 'GuideVerificationReview',
    Listing: 'Listing',
    ListingInventory: 'ListingInventory',
    ListingImage: 'ListingImage',
    Booking: 'Booking',
    PilotPayment: 'PilotPayment',
    BookingEvent: 'BookingEvent',
    IdempotencyKey: 'IdempotencyKey',
    Favorite: 'Favorite',
    Conversation: 'Conversation',
    ConversationParticipant: 'ConversationParticipant',
    UserBlock: 'UserBlock',
    Report: 'Report',
    ModerationAction: 'ModerationAction',
    Message: 'Message',
    Notification: 'Notification',
    PaymentMethod: 'PaymentMethod',
    Review: 'Review',
    Post: 'Post',
    PostImage: 'PostImage',
    PostLike: 'PostLike',
    PostComment: 'PostComment',
    Follow: 'Follow'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    phone: 'phone',
    avatarUrl: 'avatarUrl',
    provider: 'provider',
    providerSubject: 'providerSubject',
    roles: 'roles',
    isVerified: 'isVerified',
    emailVerifiedAt: 'emailVerifiedAt',
    moderationStatus: 'moderationStatus',
    suspendedUntil: 'suspendedUntil',
    suspensionReason: 'suspensionReason',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const RefreshTokenScalarFieldEnum = {
    id: 'id',
    tokenHash: 'tokenHash',
    family: 'family',
    userAgent: 'userAgent',
    ipAddress: 'ipAddress',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    createdAt: 'createdAt',
    userId: 'userId'
};
export const EmailVerificationTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    sentAt: 'sentAt',
    usedAt: 'usedAt',
    createdAt: 'createdAt'
};
export const PasswordResetTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    requestedAt: 'requestedAt',
    usedAt: 'usedAt',
    createdAt: 'createdAt'
};
export const GuideProfileScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    country: 'country',
    city: 'city',
    bio: 'bio',
    experienceYears: 'experienceYears',
    languages: 'languages',
    expertise: 'expertise',
    availability: 'availability',
    pricingType: 'pricingType',
    price: 'price',
    status: 'status',
    verified: 'verified',
    legalRole: 'legalRole',
    routeBadges: 'routeBadges',
    specialtySkills: 'specialtySkills',
    firstAidVerified: 'firstAidVerified',
    languageEstimate: 'languageEstimate',
    assessmentScore: 'assessmentScore',
    referenceContact: 'referenceContact',
    codeOfConductAccepted: 'codeOfConductAccepted',
    rankPoints: 'rankPoints',
    completedTrips: 'completedTrips',
    responseRate: 'responseRate',
    acceptanceRate: 'acceptanceRate',
    providerCancellationCount: 'providerCancellationCount',
    confirmedReportCount: 'confirmedReportCount',
    rankingUpdatedAt: 'rankingUpdatedAt',
    rating: 'rating',
    reviewCount: 'reviewCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const GuideEvidenceScalarFieldEnum = {
    id: 'id',
    guideProfileId: 'guideProfileId',
    type: 'type',
    issuer: 'issuer',
    reference: 'reference',
    verifiedAt: 'verifiedAt',
    expiresAt: 'expiresAt',
    status: 'status',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const CompetencyAttemptScalarFieldEnum = {
    id: 'id',
    guideProfileId: 'guideProfileId',
    taskType: 'taskType',
    routeId: 'routeId',
    rubricVersion: 'rubricVersion',
    aiScore: 'aiScore',
    humanScores: 'humanScores',
    confidence: 'confidence',
    breakdown: 'breakdown',
    passed: 'passed',
    reviewedAt: 'reviewedAt',
    createdAt: 'createdAt'
};
export const TourismSourceScalarFieldEnum = {
    id: 'id',
    title: 'title',
    organization: 'organization',
    sourceType: 'sourceType',
    authorityLevel: 'authorityLevel',
    url: 'url',
    language: 'language',
    publishedAt: 'publishedAt',
    validFrom: 'validFrom',
    validTo: 'validTo',
    licenseOrUsageNote: 'licenseOrUsageNote',
    reviewStatus: 'reviewStatus',
    reviewedAt: 'reviewedAt',
    reviewedById: 'reviewedById',
    reviewNotes: 'reviewNotes',
    lastVerifiedAt: 'lastVerifiedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const TourismKnowledgeScalarFieldEnum = {
    id: 'id',
    sourceId: 'sourceId',
    title: 'title',
    content: 'content',
    contentHash: 'contentHash',
    chunkIndex: 'chunkIndex',
    region: 'region',
    routeFamily: 'routeFamily',
    category: 'category',
    language: 'language',
    embedding: 'embedding',
    embeddingReference: 'embeddingReference',
    embeddingModel: 'embeddingModel',
    tokenCount: 'tokenCount',
    metadata: 'metadata',
    active: 'active',
    lastVerifiedAt: 'lastVerifiedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ResearchRouteScalarFieldEnum = {
    id: 'id',
    sourceId: 'sourceId',
    code: 'code',
    name: 'name',
    routeFamily: 'routeFamily',
    description: 'description',
    minimumDays: 'minimumDays',
    recommendedDays: 'recommendedDays',
    riskLevel: 'riskLevel',
    minimumLanguageLevel: 'minimumLanguageLevel',
    routeBadge: 'routeBadge',
    firstAidRequired: 'firstAidRequired',
    requiredGuideLegalRole: 'requiredGuideLegalRole',
    requiredSpecialtySkills: 'requiredSpecialtySkills',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const RouteNodeScalarFieldEnum = {
    id: 'id',
    routeId: 'routeId',
    sourceId: 'sourceId',
    destinationId: 'destinationId',
    code: 'code',
    name: 'name',
    nameMn: 'nameMn',
    nameEn: 'nameEn',
    region: 'region',
    latitude: 'latitude',
    longitude: 'longitude',
    altitude: 'altitude',
    nodeType: 'nodeType',
    sequenceHint: 'sequenceHint',
    minimumVisitMinutes: 'minimumVisitMinutes',
    seasonalityMetadata: 'seasonalityMetadata',
    accessMetadata: 'accessMetadata',
    safetyMetadata: 'safetyMetadata',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const RouteEdgeScalarFieldEnum = {
    id: 'id',
    routeId: 'routeId',
    fromNodeId: 'fromNodeId',
    toNodeId: 'toNodeId',
    sourceId: 'sourceId',
    code: 'code',
    transportMode: 'transportMode',
    distanceKm: 'distanceKm',
    estimatedTravelMinutes: 'estimatedTravelMinutes',
    estimatedCostMinor: 'estimatedCostMinor',
    estimatedCostCurrency: 'estimatedCostCurrency',
    terrain: 'terrain',
    riskLevel: 'riskLevel',
    seasonality: 'seasonality',
    bidirectional: 'bidirectional',
    requiresRoadCheck: 'requiresRoadCheck',
    requiresWeatherCheck: 'requiresWeatherCheck',
    requiresPermitCheck: 'requiresPermitCheck',
    requiresGuide: 'requiresGuide',
    requiredGuideCompetencies: 'requiredGuideCompetencies',
    emergencyPlanRequired: 'emergencyPlanRequired',
    active: 'active',
    lastVerifiedAt: 'lastVerifiedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const SafetyPlanScalarFieldEnum = {
    id: 'id',
    routeId: 'routeId',
    createdById: 'createdById',
    guideProfileId: 'guideProfileId',
    reviewedById: 'reviewedById',
    title: 'title',
    tripStartAt: 'tripStartAt',
    tripEndAt: 'tripEndAt',
    riskLevelSnapshot: 'riskLevelSnapshot',
    itinerary: 'itinerary',
    emergencyContacts: 'emergencyContacts',
    communicationsPlan: 'communicationsPlan',
    evacuationPlan: 'evacuationPlan',
    medicalPlan: 'medicalPlan',
    riskMitigations: 'riskMitigations',
    equipmentChecklist: 'equipmentChecklist',
    permitReferences: 'permitReferences',
    status: 'status',
    version: 'version',
    submittedAt: 'submittedAt',
    approvedAt: 'approvedAt',
    rejectedAt: 'rejectedAt',
    revokedAt: 'revokedAt',
    expiresAt: 'expiresAt',
    reviewNotes: 'reviewNotes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const SafetyPlanAuditScalarFieldEnum = {
    id: 'id',
    safetyPlanId: 'safetyPlanId',
    actorId: 'actorId',
    action: 'action',
    fromStatus: 'fromStatus',
    toStatus: 'toStatus',
    planVersion: 'planVersion',
    snapshot: 'snapshot',
    reason: 'reason',
    createdAt: 'createdAt'
};
export const GuideCompetencyScalarFieldEnum = {
    id: 'id',
    guideProfileId: 'guideProfileId',
    routeId: 'routeId',
    assessmentAttemptId: 'assessmentAttemptId',
    competencyType: 'competencyType',
    competencyCode: 'competencyCode',
    score: 'score',
    status: 'status',
    verifiedById: 'verifiedById',
    verificationMethod: 'verificationMethod',
    validFrom: 'validFrom',
    validTo: 'validTo',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const GuideLanguageAssessmentScalarFieldEnum = {
    id: 'id',
    guideProfileId: 'guideProfileId',
    assessmentAttemptId: 'assessmentAttemptId',
    language: 'language',
    officialEvidenceType: 'officialEvidenceType',
    officialEvidenceValue: 'officialEvidenceValue',
    aiEstimatedCefr: 'aiEstimatedCefr',
    aiConfidence: 'aiConfidence',
    fluencyScore: 'fluencyScore',
    grammarScore: 'grammarScore',
    vocabularyScore: 'vocabularyScore',
    interactionScore: 'interactionScore',
    clarityScore: 'clarityScore',
    humanVerifiedCefr: 'humanVerifiedCefr',
    assessmentStatus: 'assessmentStatus',
    verifiedById: 'verifiedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const GuideKnowledgeAssessmentScalarFieldEnum = {
    id: 'id',
    guideProfileId: 'guideProfileId',
    assessmentAttemptId: 'assessmentAttemptId',
    historyScore: 'historyScore',
    cultureScore: 'cultureScore',
    geographyNatureScore: 'geographyNatureScore',
    lawEthicsScore: 'lawEthicsScore',
    societyEconomyScore: 'societyEconomyScore',
    totalScore: 'totalScore',
    pass: 'pass',
    evaluatorType: 'evaluatorType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const GuideSkillAssessmentScalarFieldEnum = {
    id: 'id',
    guideProfileId: 'guideProfileId',
    assessmentAttemptId: 'assessmentAttemptId',
    communicationScore: 'communicationScore',
    guidingTechniqueScore: 'guidingTechniqueScore',
    explanationStructureScore: 'explanationStructureScore',
    factualPresentationScore: 'factualPresentationScore',
    groupCareScore: 'groupCareScore',
    questionHandlingScore: 'questionHandlingScore',
    professionalismScore: 'professionalismScore',
    totalScore: 'totalScore',
    aiConfidence: 'aiConfidence',
    humanReviewStatus: 'humanReviewStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const GuideRouteCompetencyScalarFieldEnum = {
    id: 'id',
    guideProfileId: 'guideProfileId',
    routeId: 'routeId',
    assessmentAttemptId: 'assessmentAttemptId',
    routeFamily: 'routeFamily',
    score: 'score',
    status: 'status',
    passedAt: 'passedAt',
    expiresAt: 'expiresAt',
    evaluatorType: 'evaluatorType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const GuideFirstAidScalarFieldEnum = {
    id: 'id',
    guideProfileId: 'guideProfileId',
    assessmentAttemptId: 'assessmentAttemptId',
    certificateProvider: 'certificateProvider',
    certificateReference: 'certificateReference',
    issuedAt: 'issuedAt',
    expiresAt: 'expiresAt',
    certificateStatus: 'certificateStatus',
    theoryScore: 'theoryScore',
    practicalVerificationStatus: 'practicalVerificationStatus',
    verifiedAt: 'verifiedAt',
    verifiedById: 'verifiedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const AssessmentQuestionScalarFieldEnum = {
    id: 'id',
    category: 'category',
    routeFamily: 'routeFamily',
    difficulty: 'difficulty',
    language: 'language',
    questionType: 'questionType',
    prompt: 'prompt',
    responseOptions: 'responseOptions',
    answerKey: 'answerKey',
    scoringRubric: 'scoringRubric',
    active: 'active',
    sourceId: 'sourceId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const AssessmentAttemptScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    guideProfileId: 'guideProfileId',
    routeId: 'routeId',
    routeFamily: 'routeFamily',
    assessmentType: 'assessmentType',
    language: 'language',
    status: 'status',
    rubricVersion: 'rubricVersion',
    startedAt: 'startedAt',
    submittedAt: 'submittedAt',
    completedAt: 'completedAt',
    score: 'score',
    aiScore: 'aiScore',
    humanScore: 'humanScore',
    passed: 'passed',
    humanPassed: 'humanPassed',
    aiEstimatedCefr: 'aiEstimatedCefr',
    humanCefr: 'humanCefr',
    aiConfidence: 'aiConfidence',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const AssessmentResponseScalarFieldEnum = {
    id: 'id',
    assessmentAttemptId: 'assessmentAttemptId',
    questionId: 'questionId',
    responseText: 'responseText',
    responsePayload: 'responsePayload',
    audioReference: 'audioReference',
    aiScore: 'aiScore',
    humanScore: 'humanScore',
    aiFeedback: 'aiFeedback',
    humanFeedback: 'humanFeedback',
    unsafeActionDetected: 'unsafeActionDetected',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const AssessmentReviewScalarFieldEnum = {
    id: 'id',
    assessmentAttemptId: 'assessmentAttemptId',
    reviewerId: 'reviewerId',
    blindEvaluation: 'blindEvaluation',
    decision: 'decision',
    humanScore: 'humanScore',
    humanPassed: 'humanPassed',
    humanCefr: 'humanCefr',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const AiConversationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    title: 'title',
    experimentMode: 'experimentMode',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const AiMessageScalarFieldEnum = {
    id: 'id',
    conversationId: 'conversationId',
    role: 'role',
    content: 'content',
    structuredContent: 'structuredContent',
    sources: 'sources',
    toolName: 'toolName',
    model: 'model',
    tokenCount: 'tokenCount',
    createdAt: 'createdAt'
};
export const AiExperimentRunScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    conversationId: 'conversationId',
    routeId: 'routeId',
    experimentMode: 'experimentMode',
    requestType: 'requestType',
    provider: 'provider',
    model: 'model',
    promptVersion: 'promptVersion',
    routeFamily: 'routeFamily',
    inputTokens: 'inputTokens',
    outputTokens: 'outputTokens',
    latencyMs: 'latencyMs',
    estimatedCost: 'estimatedCost',
    toolCalls: 'toolCalls',
    validatorResult: 'validatorResult',
    finalValidity: 'finalValidity',
    failureReason: 'failureReason',
    metadata: 'metadata',
    createdAt: 'createdAt'
};
export const AiEvaluationResultScalarFieldEnum = {
    id: 'id',
    experimentRunId: 'experimentRunId',
    reviewerId: 'reviewerId',
    evaluatorType: 'evaluatorType',
    blindEvaluation: 'blindEvaluation',
    factualAccuracy: 'factualAccuracy',
    hallucinationDetected: 'hallucinationDetected',
    poiValidity: 'poiValidity',
    spatialFeasibility: 'spatialFeasibility',
    temporalFeasibility: 'temporalFeasibility',
    budgetCompliance: 'budgetCompliance',
    seasonCompliance: 'seasonCompliance',
    safetyViolation: 'safetyViolation',
    personalizationScore: 'personalizationScore',
    aiScore: 'aiScore',
    humanScore: 'humanScore',
    aiPass: 'aiPass',
    humanPass: 'humanPass',
    aiCefr: 'aiCefr',
    humanCefr: 'humanCefr',
    safetyFalseNegative: 'safetyFalseNegative',
    safetyFalsePositive: 'safetyFalsePositive',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const GuideMatchRunScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    routeId: 'routeId',
    experimentRunId: 'experimentRunId',
    routeFamily: 'routeFamily',
    requestedStartAt: 'requestedStartAt',
    requestedEndAt: 'requestedEndAt',
    language: 'language',
    minimumCefr: 'minimumCefr',
    requirements: 'requirements',
    weights: 'weights',
    createdAt: 'createdAt'
};
export const GuideMatchResultScalarFieldEnum = {
    id: 'id',
    guideMatchRunId: 'guideMatchRunId',
    guideProfileId: 'guideProfileId',
    eligible: 'eligible',
    score: 'score',
    rank: 'rank',
    hardGateFailures: 'hardGateFailures',
    factors: 'factors',
    reasons: 'reasons',
    createdAt: 'createdAt'
};
export const GuideVerificationReviewScalarFieldEnum = {
    id: 'id',
    guideProfileId: 'guideProfileId',
    reviewerId: 'reviewerId',
    decision: 'decision',
    decisionReason: 'decisionReason',
    internalNote: 'internalNote',
    assessmentScore: 'assessmentScore',
    assessmentBreakdown: 'assessmentBreakdown',
    documentStatus: 'documentStatus',
    referenceStatus: 'referenceStatus',
    applicationSnapshot: 'applicationSnapshot',
    reviewedAt: 'reviewedAt'
};
export const ListingScalarFieldEnum = {
    id: 'id',
    slug: 'slug',
    title: 'title',
    location: 'location',
    description: 'description',
    category: 'category',
    price: 'price',
    basePriceMinor: 'basePriceMinor',
    cleaningFeeMinor: 'cleaningFeeMinor',
    serviceFeeMinor: 'serviceFeeMinor',
    taxMinor: 'taxMinor',
    extraGuestFeeMinor: 'extraGuestFeeMinor',
    depositMinor: 'depositMinor',
    currency: 'currency',
    priceUnit: 'priceUnit',
    datesLabel: 'datesLabel',
    tags: 'tags',
    amenities: 'amenities',
    rating: 'rating',
    reviewCount: 'reviewCount',
    published: 'published',
    status: 'status',
    defaultTotalUnits: 'defaultTotalUnits',
    hostId: 'hostId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const ListingInventoryScalarFieldEnum = {
    id: 'id',
    listingId: 'listingId',
    date: 'date',
    totalUnits: 'totalUnits',
    reservedUnits: 'reservedUnits',
    availableUnits: 'availableUnits',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ListingImageScalarFieldEnum = {
    id: 'id',
    url: 'url',
    alt: 'alt',
    sortOrder: 'sortOrder',
    listingId: 'listingId'
};
export const BookingScalarFieldEnum = {
    id: 'id',
    travelerId: 'travelerId',
    guideId: 'guideId',
    listingId: 'listingId',
    startsAt: 'startsAt',
    endsAt: 'endsAt',
    guests: 'guests',
    amount: 'amount',
    amountMinor: 'amountMinor',
    baseAmountMinor: 'baseAmountMinor',
    cleaningFeeMinor: 'cleaningFeeMinor',
    serviceFeeMinor: 'serviceFeeMinor',
    taxMinor: 'taxMinor',
    extraGuestFeeMinor: 'extraGuestFeeMinor',
    depositMinor: 'depositMinor',
    currency: 'currency',
    status: 'status',
    note: 'note',
    expiresAt: 'expiresAt',
    cancellationPolicy: 'cancellationPolicy',
    freeCancellationUntil: 'freeCancellationUntil',
    lateCancellationPercent: 'lateCancellationPercent',
    noShowPercent: 'noShowPercent',
    cancellationFee: 'cancellationFee',
    cancellationFeeMinor: 'cancellationFeeMinor',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    cancelledAt: 'cancelledAt',
    deletedAt: 'deletedAt'
};
export const PilotPaymentScalarFieldEnum = {
    id: 'id',
    bookingId: 'bookingId',
    arrangement: 'arrangement',
    status: 'status',
    instructions: 'instructions',
    proposedById: 'proposedById',
    agreedByTravelerAt: 'agreedByTravelerAt',
    agreedByProviderAt: 'agreedByProviderAt',
    paidAt: 'paidAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const BookingEventScalarFieldEnum = {
    id: 'id',
    bookingId: 'bookingId',
    actorId: 'actorId',
    actorType: 'actorType',
    fromStatus: 'fromStatus',
    toStatus: 'toStatus',
    eventType: 'eventType',
    reason: 'reason',
    metadata: 'metadata',
    createdAt: 'createdAt'
};
export const IdempotencyKeyScalarFieldEnum = {
    id: 'id',
    key: 'key',
    userId: 'userId',
    requestHash: 'requestHash',
    responseBody: 'responseBody',
    statusCode: 'statusCode',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
export const FavoriteScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    listingId: 'listingId',
    createdAt: 'createdAt'
};
export const ConversationScalarFieldEnum = {
    id: 'id',
    bookingId: 'bookingId',
    title: 'title',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const ConversationParticipantScalarFieldEnum = {
    id: 'id',
    conversationId: 'conversationId',
    userId: 'userId',
    lastReadAt: 'lastReadAt',
    joinedAt: 'joinedAt',
    mutedAt: 'mutedAt'
};
export const UserBlockScalarFieldEnum = {
    id: 'id',
    blockerId: 'blockerId',
    blockedId: 'blockedId',
    createdAt: 'createdAt'
};
export const ReportScalarFieldEnum = {
    id: 'id',
    reporterId: 'reporterId',
    reason: 'reason',
    targetType: 'targetType',
    targetId: 'targetId',
    details: 'details',
    status: 'status',
    resolution: 'resolution',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    resolvedAt: 'resolvedAt'
};
export const ModerationActionScalarFieldEnum = {
    id: 'id',
    reportId: 'reportId',
    adminId: 'adminId',
    action: 'action',
    reason: 'reason',
    metadata: 'metadata',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
export const MessageScalarFieldEnum = {
    id: 'id',
    conversationId: 'conversationId',
    senderId: 'senderId',
    type: 'type',
    body: 'body',
    mediaUrl: 'mediaUrl',
    sentAt: 'sentAt',
    deletedAt: 'deletedAt'
};
export const NotificationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    title: 'title',
    body: 'body',
    data: 'data',
    readAt: 'readAt',
    createdAt: 'createdAt'
};
export const PaymentMethodScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    providerRef: 'providerRef',
    brand: 'brand',
    last4: 'last4',
    expMonth: 'expMonth',
    expYear: 'expYear',
    isDefault: 'isDefault',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
};
export const ReviewScalarFieldEnum = {
    id: 'id',
    bookingId: 'bookingId',
    authorId: 'authorId',
    guideId: 'guideId',
    listingId: 'listingId',
    rating: 'rating',
    text: 'text',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const PostScalarFieldEnum = {
    id: 'id',
    authorId: 'authorId',
    text: 'text',
    location: 'location',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const PostImageScalarFieldEnum = {
    id: 'id',
    postId: 'postId',
    url: 'url',
    sortOrder: 'sortOrder'
};
export const PostLikeScalarFieldEnum = {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    createdAt: 'createdAt'
};
export const PostCommentScalarFieldEnum = {
    id: 'id',
    postId: 'postId',
    authorId: 'authorId',
    text: 'text',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
export const FollowScalarFieldEnum = {
    id: 'id',
    followerId: 'followerId',
    followingId: 'followingId',
    createdAt: 'createdAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const JsonNullValueInput = {
    JsonNull: JsonNull
};
export const NullableJsonNullValueInput = {
    DbNull: DbNull,
    JsonNull: JsonNull
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
export const JsonNullValueFilter = {
    DbNull: DbNull,
    JsonNull: JsonNull,
    AnyNull: AnyNull
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map