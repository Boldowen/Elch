export declare const Role: {
    readonly TRAVELER: "TRAVELER";
    readonly GUIDE: "GUIDE";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const AuthProvider: {
    readonly EMAIL: "EMAIL";
    readonly GOOGLE: "GOOGLE";
    readonly APPLE: "APPLE";
};
export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];
export declare const GuideStatus: {
    readonly DRAFT: "DRAFT";
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type GuideStatus = (typeof GuideStatus)[keyof typeof GuideStatus];
export declare const GuideVerificationDecision: {
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type GuideVerificationDecision = (typeof GuideVerificationDecision)[keyof typeof GuideVerificationDecision];
export declare const VerificationCheckStatus: {
    readonly PENDING: "PENDING";
    readonly VERIFIED: "VERIFIED";
    readonly FAILED: "FAILED";
    readonly NOT_PROVIDED: "NOT_PROVIDED";
    readonly EXPIRED: "EXPIRED";
};
export type VerificationCheckStatus = (typeof VerificationCheckStatus)[keyof typeof VerificationCheckStatus];
export declare const UserModerationStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly TEMPORARILY_SUSPENDED: "TEMPORARILY_SUSPENDED";
    readonly PERMANENTLY_SUSPENDED: "PERMANENTLY_SUSPENDED";
};
export type UserModerationStatus = (typeof UserModerationStatus)[keyof typeof UserModerationStatus];
export declare const ReportReason: {
    readonly SPAM: "SPAM";
    readonly HARASSMENT: "HARASSMENT";
    readonly SCAM: "SCAM";
    readonly UNSAFE_GUIDE_BEHAVIOR: "UNSAFE_GUIDE_BEHAVIOR";
    readonly FAKE_LISTING: "FAKE_LISTING";
    readonly INAPPROPRIATE_CONTENT: "INAPPROPRIATE_CONTENT";
    readonly PAYMENT_FRAUD: "PAYMENT_FRAUD";
    readonly OTHER: "OTHER";
};
export type ReportReason = (typeof ReportReason)[keyof typeof ReportReason];
export declare const ReportTargetType: {
    readonly USER: "USER";
    readonly LISTING: "LISTING";
    readonly GUIDE: "GUIDE";
    readonly POST: "POST";
    readonly MESSAGE: "MESSAGE";
    readonly BOOKING: "BOOKING";
};
export type ReportTargetType = (typeof ReportTargetType)[keyof typeof ReportTargetType];
export declare const ReportStatus: {
    readonly OPEN: "OPEN";
    readonly UNDER_REVIEW: "UNDER_REVIEW";
    readonly RESOLVED: "RESOLVED";
    readonly DISMISSED: "DISMISSED";
};
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];
export declare const ModerationActionType: {
    readonly REPORT_DISMISS: "REPORT_DISMISS";
    readonly CONTENT_REMOVE: "CONTENT_REMOVE";
    readonly WARNING: "WARNING";
    readonly TEMPORARY_SUSPENSION: "TEMPORARY_SUSPENSION";
    readonly PERMANENT_SUSPENSION: "PERMANENT_SUSPENSION";
    readonly LISTING_UNPUBLISH: "LISTING_UNPUBLISH";
    readonly GUIDE_VERIFICATION_REVOKE: "GUIDE_VERIFICATION_REVOKE";
};
export type ModerationActionType = (typeof ModerationActionType)[keyof typeof ModerationActionType];
export declare const PaymentArrangement: {
    readonly CASH_ON_ARRIVAL: "CASH_ON_ARRIVAL";
    readonly BANK_TRANSFER: "BANK_TRANSFER";
    readonly PROVIDER_TERMINAL: "PROVIDER_TERMINAL";
    readonly ONLINE_PAYMENT: "ONLINE_PAYMENT";
};
export type PaymentArrangement = (typeof PaymentArrangement)[keyof typeof PaymentArrangement];
export declare const PaymentStatus: {
    readonly NOT_REQUIRED: "NOT_REQUIRED";
    readonly PENDING: "PENDING";
    readonly AGREED: "AGREED";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
    readonly REFUND_PENDING: "REFUND_PENDING";
    readonly REFUNDED: "REFUNDED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const ListingCategory: {
    readonly TRENDING: "TRENDING";
    readonly HOTEL: "HOTEL";
    readonly FOODS: "FOODS";
    readonly NATURE: "NATURE";
};
export type ListingCategory = (typeof ListingCategory)[keyof typeof ListingCategory];
export declare const ListingStatus: {
    readonly DRAFT: "DRAFT";
    readonly PENDING_REVIEW: "PENDING_REVIEW";
    readonly PUBLISHED: "PUBLISHED";
    readonly SUSPENDED: "SUSPENDED";
    readonly ARCHIVED: "ARCHIVED";
};
export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];
export declare const PriceUnit: {
    readonly PER_NIGHT: "PER_NIGHT";
    readonly PER_HOUR: "PER_HOUR";
    readonly PER_DAY: "PER_DAY";
    readonly PER_PERSON: "PER_PERSON";
    readonly PER_GROUP: "PER_GROUP";
    readonly PACKAGE: "PACKAGE";
};
export type PriceUnit = (typeof PriceUnit)[keyof typeof PriceUnit];
export declare const BookingStatus: {
    readonly DRAFT: "DRAFT";
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly DECLINED: "DECLINED";
    readonly CANCELLED_BY_TRAVELER: "CANCELLED_BY_TRAVELER";
    readonly CANCELLED_BY_PROVIDER: "CANCELLED_BY_PROVIDER";
    readonly EXPIRED: "EXPIRED";
    readonly NO_SHOW: "NO_SHOW";
    readonly DISPUTED: "DISPUTED";
    readonly REFUND_PENDING: "REFUND_PENDING";
    readonly REFUNDED: "REFUNDED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export declare const BookingActorType: {
    readonly TRAVELER: "TRAVELER";
    readonly PROVIDER: "PROVIDER";
    readonly SYSTEM: "SYSTEM";
    readonly ADMIN: "ADMIN";
};
export type BookingActorType = (typeof BookingActorType)[keyof typeof BookingActorType];
export declare const CancellationPolicyType: {
    readonly FLEXIBLE: "FLEXIBLE";
    readonly MODERATE: "MODERATE";
    readonly STRICT: "STRICT";
    readonly CUSTOM: "CUSTOM";
};
export type CancellationPolicyType = (typeof CancellationPolicyType)[keyof typeof CancellationPolicyType];
export declare const MessageType: {
    readonly TEXT: "TEXT";
    readonly IMAGE: "IMAGE";
    readonly SYSTEM: "SYSTEM";
};
export type MessageType = (typeof MessageType)[keyof typeof MessageType];
export declare const NotificationType: {
    readonly BOOKING_CREATED: "BOOKING_CREATED";
    readonly BOOKING_ACCEPTED: "BOOKING_ACCEPTED";
    readonly BOOKING_DECLINED: "BOOKING_DECLINED";
    readonly BOOKING_CANCELLED: "BOOKING_CANCELLED";
    readonly BOOKING_STARTED: "BOOKING_STARTED";
    readonly BOOKING_COMPLETED: "BOOKING_COMPLETED";
    readonly BOOKING_EXPIRED: "BOOKING_EXPIRED";
    readonly NEW_MESSAGE: "NEW_MESSAGE";
    readonly GUIDE_APPLICATION_APPROVED: "GUIDE_APPLICATION_APPROVED";
    readonly GUIDE_APPLICATION_REJECTED: "GUIDE_APPLICATION_REJECTED";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
export declare const PricingType: {
    readonly HOURLY: "HOURLY";
    readonly PACKAGE: "PACKAGE";
    readonly NONE: "NONE";
};
export type PricingType = (typeof PricingType)[keyof typeof PricingType];
export declare const GuideLegalRole: {
    readonly UNVERIFIED: "UNVERIFIED";
    readonly LICENSED_PROFESSIONAL: "LICENSED_PROFESSIONAL";
    readonly LICENSED_PROFESSIONAL_GUIDE: "LICENSED_PROFESSIONAL_GUIDE";
    readonly LOCAL_HOST: "LOCAL_HOST";
    readonly SPECIALIST_INSTRUCTOR: "SPECIALIST_INSTRUCTOR";
};
export type GuideLegalRole = (typeof GuideLegalRole)[keyof typeof GuideLegalRole];
export declare const GuideEvidenceType: {
    readonly IDENTITY: "IDENTITY";
    readonly PROFESSIONAL_LICENSE: "PROFESSIONAL_LICENSE";
    readonly LANGUAGE: "LANGUAGE";
    readonly FIRST_AID: "FIRST_AID";
    readonly INSURANCE: "INSURANCE";
    readonly SPECIALTY: "SPECIALTY";
};
export type GuideEvidenceType = (typeof GuideEvidenceType)[keyof typeof GuideEvidenceType];
export declare const CompetencyTaskType: {
    readonly PERFORMANCE: "PERFORMANCE";
    readonly GENERAL_KNOWLEDGE: "GENERAL_KNOWLEDGE";
    readonly ROUTE_KNOWLEDGE: "ROUTE_KNOWLEDGE";
    readonly LANGUAGE: "LANGUAGE";
    readonly FIRST_AID_THEORY: "FIRST_AID_THEORY";
    readonly SAFETY_SCENARIO: "SAFETY_SCENARIO";
};
export type CompetencyTaskType = (typeof CompetencyTaskType)[keyof typeof CompetencyTaskType];
export declare const TourismSourceType: {
    readonly WEBSITE: "WEBSITE";
    readonly LAW: "LAW";
    readonly REGULATION: "REGULATION";
    readonly REPORT: "REPORT";
    readonly DATASET: "DATASET";
    readonly MAP: "MAP";
    readonly ARTICLE: "ARTICLE";
    readonly BOOK: "BOOK";
    readonly OTHER: "OTHER";
};
export type TourismSourceType = (typeof TourismSourceType)[keyof typeof TourismSourceType];
export declare const TourismSourceReviewStatus: {
    readonly PENDING: "PENDING";
    readonly HUMAN_VERIFIED: "HUMAN_VERIFIED";
    readonly REJECTED: "REJECTED";
};
export type TourismSourceReviewStatus = (typeof TourismSourceReviewStatus)[keyof typeof TourismSourceReviewStatus];
export declare const TourismAuthorityLevel: {
    readonly GOVERNMENT: "GOVERNMENT";
    readonly LEGAL: "LEGAL";
    readonly OFFICIAL_TOURISM: "OFFICIAL_TOURISM";
    readonly UNESCO: "UNESCO";
    readonly LOCAL_AUTHORITY: "LOCAL_AUTHORITY";
    readonly MUSEUM: "MUSEUM";
    readonly PROTECTED_AREA: "PROTECTED_AREA";
    readonly VERIFIED_OPERATOR: "VERIFIED_OPERATOR";
    readonly OTHER: "OTHER";
};
export type TourismAuthorityLevel = (typeof TourismAuthorityLevel)[keyof typeof TourismAuthorityLevel];
export declare const TourismKnowledgeCategory: {
    readonly HISTORY: "HISTORY";
    readonly CULTURE: "CULTURE";
    readonly GEOGRAPHY: "GEOGRAPHY";
    readonly NATURE: "NATURE";
    readonly LAW: "LAW";
    readonly SAFETY: "SAFETY";
    readonly FIRST_AID_REFERENCE: "FIRST_AID_REFERENCE";
    readonly ROUTE_INFORMATION: "ROUTE_INFORMATION";
    readonly DESTINATION_INFORMATION: "DESTINATION_INFORMATION";
    readonly TOURISM_GUIDANCE: "TOURISM_GUIDANCE";
};
export type TourismKnowledgeCategory = (typeof TourismKnowledgeCategory)[keyof typeof TourismKnowledgeCategory];
export declare const RouteFamily: {
    readonly CENTRAL_HERITAGE: "CENTRAL_HERITAGE";
    readonly GOBI: "GOBI";
    readonly KHUVSGUL: "KHUVSGUL";
    readonly WESTERN_ALTAI: "WESTERN_ALTAI";
};
export type RouteFamily = (typeof RouteFamily)[keyof typeof RouteFamily];
export declare const RouteRiskLevel: {
    readonly R0: "R0";
    readonly R1: "R1";
    readonly R2: "R2";
    readonly R3: "R3";
    readonly R4: "R4";
};
export type RouteRiskLevel = (typeof RouteRiskLevel)[keyof typeof RouteRiskLevel];
export declare const RouteNodeType: {
    readonly CITY: "CITY";
    readonly DESTINATION: "DESTINATION";
    readonly HERITAGE: "HERITAGE";
    readonly MUSEUM: "MUSEUM";
    readonly NATURE: "NATURE";
    readonly TRAILHEAD: "TRAILHEAD";
    readonly TRANSPORT_HUB: "TRANSPORT_HUB";
    readonly ACCOMMODATION: "ACCOMMODATION";
    readonly OTHER: "OTHER";
};
export type RouteNodeType = (typeof RouteNodeType)[keyof typeof RouteNodeType];
export declare const RouteTransportMode: {
    readonly ROAD: "ROAD";
    readonly OFF_ROAD: "OFF_ROAD";
    readonly TREK: "TREK";
    readonly BOAT: "BOAT";
    readonly AIR: "AIR";
    readonly RAIL: "RAIL";
    readonly HORSE: "HORSE";
    readonly OTHER: "OTHER";
};
export type RouteTransportMode = (typeof RouteTransportMode)[keyof typeof RouteTransportMode];
export declare const SafetyPlanStatus: {
    readonly DRAFT: "DRAFT";
    readonly SUBMITTED: "SUBMITTED";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly REVOKED: "REVOKED";
    readonly EXPIRED: "EXPIRED";
};
export type SafetyPlanStatus = (typeof SafetyPlanStatus)[keyof typeof SafetyPlanStatus];
export declare const SafetyPlanAuditAction: {
    readonly CREATED: "CREATED";
    readonly UPDATED: "UPDATED";
    readonly SUBMITTED: "SUBMITTED";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly REVOKED: "REVOKED";
    readonly EXPIRED: "EXPIRED";
};
export type SafetyPlanAuditAction = (typeof SafetyPlanAuditAction)[keyof typeof SafetyPlanAuditAction];
export declare const GuideCompetencyType: {
    readonly GENERAL_KNOWLEDGE: "GENERAL_KNOWLEDGE";
    readonly GUIDE_SKILL: "GUIDE_SKILL";
    readonly LANGUAGE: "LANGUAGE";
    readonly ROUTE_SPECIFIC: "ROUTE_SPECIFIC";
    readonly FIRST_AID_THEORY: "FIRST_AID_THEORY";
    readonly SAFETY: "SAFETY";
    readonly SPECIALTY: "SPECIALTY";
};
export type GuideCompetencyType = (typeof GuideCompetencyType)[keyof typeof GuideCompetencyType];
export declare const GuideCompetencyStatus: {
    readonly NOT_ASSESSED: "NOT_ASSESSED";
    readonly AI_PRE_SCREENED: "AI_PRE_SCREENED";
    readonly HUMAN_VERIFIED: "HUMAN_VERIFIED";
    readonly DOCUMENT_VERIFIED: "DOCUMENT_VERIFIED";
    readonly EXPIRED: "EXPIRED";
    readonly REJECTED: "REJECTED";
};
export type GuideCompetencyStatus = (typeof GuideCompetencyStatus)[keyof typeof GuideCompetencyStatus];
export declare const CefrLevel: {
    readonly A1: "A1";
    readonly A2: "A2";
    readonly B1: "B1";
    readonly B2: "B2";
    readonly C1: "C1";
    readonly C2: "C2";
};
export type CefrLevel = (typeof CefrLevel)[keyof typeof CefrLevel];
export declare const FirstAidCertificateStatus: {
    readonly NOT_PROVIDED: "NOT_PROVIDED";
    readonly PENDING: "PENDING";
    readonly DOCUMENT_VERIFIED: "DOCUMENT_VERIFIED";
    readonly EXPIRED: "EXPIRED";
    readonly REJECTED: "REJECTED";
};
export type FirstAidCertificateStatus = (typeof FirstAidCertificateStatus)[keyof typeof FirstAidCertificateStatus];
export declare const PracticalVerificationStatus: {
    readonly NOT_ASSESSED: "NOT_ASSESSED";
    readonly PENDING: "PENDING";
    readonly VERIFIED: "VERIFIED";
    readonly REJECTED: "REJECTED";
    readonly EXPIRED: "EXPIRED";
};
export type PracticalVerificationStatus = (typeof PracticalVerificationStatus)[keyof typeof PracticalVerificationStatus];
export declare const AssessmentCategory: {
    readonly HISTORY_ARCHAEOLOGY: "HISTORY_ARCHAEOLOGY";
    readonly RELIGION_CULTURE: "RELIGION_CULTURE";
    readonly GEOGRAPHY_NATURE: "GEOGRAPHY_NATURE";
    readonly LAW_ETHICS: "LAW_ETHICS";
    readonly SOCIETY_ECONOMY: "SOCIETY_ECONOMY";
    readonly ROUTE_SPECIFIC: "ROUTE_SPECIFIC";
    readonly SAFETY: "SAFETY";
    readonly FIRST_AID_THEORY: "FIRST_AID_THEORY";
    readonly LANGUAGE: "LANGUAGE";
    readonly GUIDE_SKILL: "GUIDE_SKILL";
};
export type AssessmentCategory = (typeof AssessmentCategory)[keyof typeof AssessmentCategory];
export declare const AssessmentQuestionType: {
    readonly MULTIPLE_CHOICE: "MULTIPLE_CHOICE";
    readonly SHORT_ANSWER: "SHORT_ANSWER";
    readonly OPEN_EXPLANATION: "OPEN_EXPLANATION";
    readonly SCENARIO: "SCENARIO";
    readonly SPEAKING_TASK: "SPEAKING_TASK";
};
export type AssessmentQuestionType = (typeof AssessmentQuestionType)[keyof typeof AssessmentQuestionType];
export declare const AssessmentDifficulty: {
    readonly BASIC: "BASIC";
    readonly INTERMEDIATE: "INTERMEDIATE";
    readonly ADVANCED: "ADVANCED";
};
export type AssessmentDifficulty = (typeof AssessmentDifficulty)[keyof typeof AssessmentDifficulty];
export declare const AssessmentType: {
    readonly LANGUAGE: "LANGUAGE";
    readonly GENERAL_KNOWLEDGE: "GENERAL_KNOWLEDGE";
    readonly GUIDE_SKILL: "GUIDE_SKILL";
    readonly ROUTE_COMPETENCY: "ROUTE_COMPETENCY";
    readonly FIRST_AID_THEORY: "FIRST_AID_THEORY";
    readonly SAFETY_SCENARIO: "SAFETY_SCENARIO";
};
export type AssessmentType = (typeof AssessmentType)[keyof typeof AssessmentType];
export declare const AssessmentAttemptStatus: {
    readonly NOT_STARTED: "NOT_STARTED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly SUBMITTED: "SUBMITTED";
    readonly AI_SCORED: "AI_SCORED";
    readonly HUMAN_REVIEWED: "HUMAN_REVIEWED";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type AssessmentAttemptStatus = (typeof AssessmentAttemptStatus)[keyof typeof AssessmentAttemptStatus];
export declare const EvaluatorType: {
    readonly AI: "AI";
    readonly HUMAN: "HUMAN";
    readonly HYBRID: "HYBRID";
};
export type EvaluatorType = (typeof EvaluatorType)[keyof typeof EvaluatorType];
export declare const HumanReviewStatus: {
    readonly NOT_REQUESTED: "NOT_REQUESTED";
    readonly PENDING: "PENDING";
    readonly BLIND_REVIEW_IN_PROGRESS: "BLIND_REVIEW_IN_PROGRESS";
    readonly VERIFIED: "VERIFIED";
    readonly REJECTED: "REJECTED";
    readonly REASSESSMENT_REQUIRED: "REASSESSMENT_REQUIRED";
};
export type HumanReviewStatus = (typeof HumanReviewStatus)[keyof typeof HumanReviewStatus];
export declare const AssessmentReviewDecision: {
    readonly VERIFIED: "VERIFIED";
    readonly REJECTED: "REJECTED";
    readonly REASSESSMENT_REQUIRED: "REASSESSMENT_REQUIRED";
};
export type AssessmentReviewDecision = (typeof AssessmentReviewDecision)[keyof typeof AssessmentReviewDecision];
export declare const AiExperimentMode: {
    readonly A: "A";
    readonly B: "B";
    readonly C: "C";
    readonly D: "D";
    readonly E: "E";
};
export type AiExperimentMode = (typeof AiExperimentMode)[keyof typeof AiExperimentMode];
export declare const AiRequestType: {
    readonly GENERAL_TRAVEL: "GENERAL_TRAVEL";
    readonly DESTINATION_QA: "DESTINATION_QA";
    readonly ITINERARY: "ITINERARY";
    readonly ROUTE_PLANNING: "ROUTE_PLANNING";
    readonly GUIDE_SEARCH: "GUIDE_SEARCH";
    readonly GUIDE_MATCHING: "GUIDE_MATCHING";
    readonly TOUR_SEARCH: "TOUR_SEARCH";
    readonly TOUR_COMPARISON: "TOUR_COMPARISON";
    readonly TRANSLATION: "TRANSLATION";
    readonly SAFETY_INFORMATION: "SAFETY_INFORMATION";
    readonly BOOKING_HELP: "BOOKING_HELP";
    readonly OTHER: "OTHER";
};
export type AiRequestType = (typeof AiRequestType)[keyof typeof AiRequestType];
export declare const AiConversationStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly ARCHIVED: "ARCHIVED";
};
export type AiConversationStatus = (typeof AiConversationStatus)[keyof typeof AiConversationStatus];
export declare const AiMessageRole: {
    readonly SYSTEM: "SYSTEM";
    readonly USER: "USER";
    readonly ASSISTANT: "ASSISTANT";
    readonly TOOL: "TOOL";
};
export type AiMessageRole = (typeof AiMessageRole)[keyof typeof AiMessageRole];
