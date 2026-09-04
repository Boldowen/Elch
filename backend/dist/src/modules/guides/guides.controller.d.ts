import { type RequestUser } from '../../common/decorators/current-user.decorator.js';
import { ApplyGuideDto } from './dto/apply-guide.dto.js';
import { ReviewGuideApplicationDto } from './dto/review-guide-application.dto.js';
import { UpdateGuideProfileDto } from './dto/update-guide-profile.dto.js';
import { GuidesService } from './guides.service.js';
export declare class GuidesController {
    private readonly guides;
    constructor(guides: GuidesService);
    all(): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        id: string;
        userId: string;
        country: string;
        city: string;
        bio: string;
        experienceYears: number;
        languages: import("@prisma/client/runtime/client").JsonValue;
        expertise: string[];
        availability: string[];
        pricingType: import("../../generated/prisma/enums.js").PricingType;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("../../generated/prisma/enums.js").GuideStatus;
        verified: boolean;
        legalRole: import("../../generated/prisma/enums.js").GuideLegalRole;
        specialtySkills: string[];
        completedTrips: number;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            isVerified: boolean;
        };
        evidence: {
            expiresAt: Date | null;
            status: import("../../generated/prisma/enums.js").VerificationCheckStatus;
            type: import("../../generated/prisma/enums.js").GuideEvidenceType;
            issuer: string;
            verifiedAt: Date | null;
        }[];
        languageAssessments: {
            createdAt: Date;
            language: string;
            aiEstimatedCefr: import("../../generated/prisma/enums.js").CefrLevel | null;
            aiConfidence: import("@prisma/client-runtime-utils").Decimal | null;
            humanVerifiedCefr: import("../../generated/prisma/enums.js").CefrLevel | null;
            assessmentStatus: import("../../generated/prisma/enums.js").GuideCompetencyStatus;
        }[];
        knowledgeAssessments: {
            createdAt: Date;
            totalScore: import("@prisma/client-runtime-utils").Decimal;
            pass: boolean;
            evaluatorType: import("../../generated/prisma/enums.js").EvaluatorType;
        }[];
        skillAssessments: {
            createdAt: Date;
            totalScore: import("@prisma/client-runtime-utils").Decimal;
            humanReviewStatus: import("../../generated/prisma/enums.js").HumanReviewStatus;
        }[];
        routeCompetencies: {
            expiresAt: Date | null;
            status: import("../../generated/prisma/enums.js").GuideCompetencyStatus;
            routeFamily: import("../../generated/prisma/enums.js").RouteFamily;
            score: import("@prisma/client-runtime-utils").Decimal;
            passedAt: Date | null;
        }[];
        firstAidRecords: {
            expiresAt: Date | null;
            certificateStatus: import("../../generated/prisma/enums.js").FirstAidCertificateStatus;
            theoryScore: import("@prisma/client-runtime-utils").Decimal | null;
            practicalVerificationStatus: import("../../generated/prisma/enums.js").PracticalVerificationStatus;
        }[];
    }[]>;
    ranking(): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        id: string;
        userId: string;
        country: string;
        city: string;
        bio: string;
        experienceYears: number;
        languages: import("@prisma/client/runtime/client").JsonValue;
        expertise: string[];
        availability: string[];
        pricingType: import("../../generated/prisma/enums.js").PricingType;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("../../generated/prisma/enums.js").GuideStatus;
        verified: boolean;
        legalRole: import("../../generated/prisma/enums.js").GuideLegalRole;
        specialtySkills: string[];
        rankPoints: number;
        completedTrips: number;
        responseRate: number;
        acceptanceRate: number;
        rankingUpdatedAt: Date | null;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            isVerified: boolean;
        };
        evidence: {
            expiresAt: Date | null;
            status: import("../../generated/prisma/enums.js").VerificationCheckStatus;
            type: import("../../generated/prisma/enums.js").GuideEvidenceType;
            issuer: string;
            verifiedAt: Date | null;
        }[];
        languageAssessments: {
            createdAt: Date;
            language: string;
            aiEstimatedCefr: import("../../generated/prisma/enums.js").CefrLevel | null;
            aiConfidence: import("@prisma/client-runtime-utils").Decimal | null;
            humanVerifiedCefr: import("../../generated/prisma/enums.js").CefrLevel | null;
            assessmentStatus: import("../../generated/prisma/enums.js").GuideCompetencyStatus;
        }[];
        knowledgeAssessments: {
            createdAt: Date;
            totalScore: import("@prisma/client-runtime-utils").Decimal;
            pass: boolean;
            evaluatorType: import("../../generated/prisma/enums.js").EvaluatorType;
        }[];
        skillAssessments: {
            createdAt: Date;
            totalScore: import("@prisma/client-runtime-utils").Decimal;
            humanReviewStatus: import("../../generated/prisma/enums.js").HumanReviewStatus;
        }[];
        routeCompetencies: {
            expiresAt: Date | null;
            status: import("../../generated/prisma/enums.js").GuideCompetencyStatus;
            routeFamily: import("../../generated/prisma/enums.js").RouteFamily;
            score: import("@prisma/client-runtime-utils").Decimal;
            passedAt: Date | null;
        }[];
        firstAidRecords: {
            expiresAt: Date | null;
            certificateStatus: import("../../generated/prisma/enums.js").FirstAidCertificateStatus;
            theoryScore: import("@prisma/client-runtime-utils").Decimal | null;
            practicalVerificationStatus: import("../../generated/prisma/enums.js").PracticalVerificationStatus;
        }[];
    }[]>;
    me(user: RequestUser): Promise<{
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        country: string;
        city: string;
        bio: string;
        experienceYears: number;
        languages: import("@prisma/client/runtime/client").JsonValue;
        expertise: string[];
        availability: string[];
        pricingType: import("../../generated/prisma/enums.js").PricingType;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("../../generated/prisma/enums.js").GuideStatus;
        verified: boolean;
        legalRole: import("../../generated/prisma/enums.js").GuideLegalRole;
        routeBadges: string[];
        specialtySkills: string[];
        firstAidVerified: boolean;
        languageEstimate: import("@prisma/client/runtime/client").JsonValue | null;
        assessmentScore: number;
        referenceContact: string | null;
        codeOfConductAccepted: boolean;
        rankPoints: number;
        completedTrips: number;
        responseRate: number;
        acceptanceRate: number;
        providerCancellationCount: number;
        confirmedReportCount: number;
        rankingUpdatedAt: Date | null;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
    }>;
    updateMine(user: RequestUser, dto: UpdateGuideProfileDto): Promise<{
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        country: string;
        city: string;
        bio: string;
        experienceYears: number;
        languages: import("@prisma/client/runtime/client").JsonValue;
        expertise: string[];
        availability: string[];
        pricingType: import("../../generated/prisma/enums.js").PricingType;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("../../generated/prisma/enums.js").GuideStatus;
        verified: boolean;
        legalRole: import("../../generated/prisma/enums.js").GuideLegalRole;
        routeBadges: string[];
        specialtySkills: string[];
        firstAidVerified: boolean;
        languageEstimate: import("@prisma/client/runtime/client").JsonValue | null;
        assessmentScore: number;
        referenceContact: string | null;
        codeOfConductAccepted: boolean;
        rankPoints: number;
        completedTrips: number;
        responseRate: number;
        acceptanceRate: number;
        providerCancellationCount: number;
        confirmedReportCount: number;
        rankingUpdatedAt: Date | null;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
    }>;
    applications(): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
            isVerified: boolean;
        };
        verificationReviews: ({
            reviewer: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            assessmentScore: number;
            guideProfileId: string;
            reviewedAt: Date;
            reviewerId: string;
            decision: import("../../generated/prisma/enums.js").GuideVerificationDecision;
            decisionReason: string | null;
            internalNote: string | null;
            assessmentBreakdown: import("@prisma/client/runtime/client").JsonValue;
            documentStatus: import("../../generated/prisma/enums.js").VerificationCheckStatus;
            referenceStatus: import("../../generated/prisma/enums.js").VerificationCheckStatus;
            applicationSnapshot: import("@prisma/client/runtime/client").JsonValue;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        country: string;
        city: string;
        bio: string;
        experienceYears: number;
        languages: import("@prisma/client/runtime/client").JsonValue;
        expertise: string[];
        availability: string[];
        pricingType: import("../../generated/prisma/enums.js").PricingType;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("../../generated/prisma/enums.js").GuideStatus;
        verified: boolean;
        legalRole: import("../../generated/prisma/enums.js").GuideLegalRole;
        routeBadges: string[];
        specialtySkills: string[];
        firstAidVerified: boolean;
        languageEstimate: import("@prisma/client/runtime/client").JsonValue | null;
        assessmentScore: number;
        referenceContact: string | null;
        codeOfConductAccepted: boolean;
        rankPoints: number;
        completedTrips: number;
        responseRate: number;
        acceptanceRate: number;
        providerCancellationCount: number;
        confirmedReportCount: number;
        rankingUpdatedAt: Date | null;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
    })[]>;
    review(user: RequestUser, id: string, dto: ReviewGuideApplicationDto): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        country: string;
        city: string;
        bio: string;
        experienceYears: number;
        languages: import("@prisma/client/runtime/client").JsonValue;
        expertise: string[];
        availability: string[];
        pricingType: import("../../generated/prisma/enums.js").PricingType;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("../../generated/prisma/enums.js").GuideStatus;
        verified: boolean;
        legalRole: import("../../generated/prisma/enums.js").GuideLegalRole;
        routeBadges: string[];
        specialtySkills: string[];
        firstAidVerified: boolean;
        languageEstimate: import("@prisma/client/runtime/client").JsonValue | null;
        assessmentScore: number;
        referenceContact: string | null;
        codeOfConductAccepted: boolean;
        rankPoints: number;
        completedTrips: number;
        responseRate: number;
        acceptanceRate: number;
        providerCancellationCount: number;
        confirmedReportCount: number;
        rankingUpdatedAt: Date | null;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
    }) | null>;
    applicationReviews(id: string): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
        reviewer: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        assessmentScore: number;
        guideProfileId: string;
        reviewedAt: Date;
        reviewerId: string;
        decision: import("../../generated/prisma/enums.js").GuideVerificationDecision;
        decisionReason: string | null;
        internalNote: string | null;
        assessmentBreakdown: import("@prisma/client/runtime/client").JsonValue;
        documentStatus: import("../../generated/prisma/enums.js").VerificationCheckStatus;
        referenceStatus: import("../../generated/prisma/enums.js").VerificationCheckStatus;
        applicationSnapshot: import("@prisma/client/runtime/client").JsonValue;
    })[]>;
    apply(user: RequestUser, dto: ApplyGuideDto): Promise<{
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        country: string;
        city: string;
        bio: string;
        experienceYears: number;
        languages: import("@prisma/client/runtime/client").JsonValue;
        expertise: string[];
        availability: string[];
        pricingType: import("../../generated/prisma/enums.js").PricingType;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("../../generated/prisma/enums.js").GuideStatus;
        verified: boolean;
        legalRole: import("../../generated/prisma/enums.js").GuideLegalRole;
        routeBadges: string[];
        specialtySkills: string[];
        firstAidVerified: boolean;
        languageEstimate: import("@prisma/client/runtime/client").JsonValue | null;
        assessmentScore: number;
        referenceContact: string | null;
        codeOfConductAccepted: boolean;
        rankPoints: number;
        completedTrips: number;
        responseRate: number;
        acceptanceRate: number;
        providerCancellationCount: number;
        confirmedReportCount: number;
        rankingUpdatedAt: Date | null;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
    }>;
    one(id: string): Promise<{
        id: string;
        userId: string;
        country: string;
        city: string;
        bio: string;
        experienceYears: number;
        languages: import("@prisma/client/runtime/client").JsonValue;
        expertise: string[];
        availability: string[];
        pricingType: import("../../generated/prisma/enums.js").PricingType;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        status: import("../../generated/prisma/enums.js").GuideStatus;
        verified: boolean;
        legalRole: import("../../generated/prisma/enums.js").GuideLegalRole;
        specialtySkills: string[];
        completedTrips: number;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            isVerified: boolean;
        };
        evidence: {
            expiresAt: Date | null;
            status: import("../../generated/prisma/enums.js").VerificationCheckStatus;
            type: import("../../generated/prisma/enums.js").GuideEvidenceType;
            issuer: string;
            verifiedAt: Date | null;
        }[];
        languageAssessments: {
            createdAt: Date;
            language: string;
            aiEstimatedCefr: import("../../generated/prisma/enums.js").CefrLevel | null;
            aiConfidence: import("@prisma/client-runtime-utils").Decimal | null;
            humanVerifiedCefr: import("../../generated/prisma/enums.js").CefrLevel | null;
            assessmentStatus: import("../../generated/prisma/enums.js").GuideCompetencyStatus;
        }[];
        knowledgeAssessments: {
            createdAt: Date;
            totalScore: import("@prisma/client-runtime-utils").Decimal;
            pass: boolean;
            evaluatorType: import("../../generated/prisma/enums.js").EvaluatorType;
        }[];
        skillAssessments: {
            createdAt: Date;
            totalScore: import("@prisma/client-runtime-utils").Decimal;
            humanReviewStatus: import("../../generated/prisma/enums.js").HumanReviewStatus;
        }[];
        routeCompetencies: {
            expiresAt: Date | null;
            status: import("../../generated/prisma/enums.js").GuideCompetencyStatus;
            routeFamily: import("../../generated/prisma/enums.js").RouteFamily;
            score: import("@prisma/client-runtime-utils").Decimal;
            passedAt: Date | null;
        }[];
        firstAidRecords: {
            expiresAt: Date | null;
            certificateStatus: import("../../generated/prisma/enums.js").FirstAidCertificateStatus;
            theoryScore: import("@prisma/client-runtime-utils").Decimal | null;
            practicalVerificationStatus: import("../../generated/prisma/enums.js").PracticalVerificationStatus;
        }[];
    }>;
}
