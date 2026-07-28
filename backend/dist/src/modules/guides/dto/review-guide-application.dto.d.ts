export declare enum GuideReviewDecision {
    APPROVE = "APPROVE",
    REJECT = "REJECT"
}
export declare class ReviewGuideApplicationDto {
    decision: GuideReviewDecision;
    assessmentScore?: number;
}
