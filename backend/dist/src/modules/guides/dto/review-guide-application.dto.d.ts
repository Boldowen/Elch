import { VerificationCheckStatus } from '../../../generated/prisma/client.js';
export declare enum GuideReviewDecision {
    APPROVE = "APPROVE",
    REJECT = "REJECT"
}
export declare class AssessmentBreakdownDto {
    localKnowledge: number;
    communication: number;
    safety: number;
    professionalism: number;
}
export declare class ReviewGuideApplicationDto {
    decision: GuideReviewDecision;
    decisionReason?: string;
    internalNote?: string;
    assessmentBreakdown: AssessmentBreakdownDto;
    documentStatus: VerificationCheckStatus;
    referenceStatus: VerificationCheckStatus;
}
