import { PrismaService } from '../../prisma/prisma.service.js';
export interface RankingMetrics {
    rating: number;
    reviewCount: number;
    globalRating: number;
    completedTrips: number;
    responseRate: number;
    acceptanceRate: number;
    daysSinceActivity: number;
    assessmentScore: number;
    providerCancellations: number;
    confirmedReports: number;
}
export declare class RankingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    calculate(metrics: RankingMetrics): {
        rankPoints: number;
        bayesianRating: number;
        qualityPoints: number;
        tripPoints: number;
        responsePoints: number;
        acceptancePoints: number;
        activityPoints: number;
        assessmentPoints: number;
        cancellationPenalty: number;
        reportPenalty: number;
    };
    recalculateAll(): Promise<{
        recalculated: number;
    }>;
    recalculateGuide(userId: string, now?: Date): Promise<{
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
    } | null>;
    private clamp;
}
