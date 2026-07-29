import { ModerationActionType, ReportStatus, ReportTargetType } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { ModerateReportDto } from './dto/moderate-report.dto.js';
export declare class TrustSafetyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    block(blockerId: string, blockedId: string): Promise<{
        blocked: boolean;
    }>;
    unblock(blockerId: string, blockedId: string): Promise<{
        blocked: boolean;
    }>;
    listBlocked(userId: string): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
        blocked: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        blockerId: string;
        blockedId: string;
    })[]>;
    assertInteractionAllowed(firstUserId: string, secondUserId: string): Promise<void>;
    createReport(reporterId: string, dto: CreateReportDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: ReportStatus;
        reason: import("../../generated/prisma/enums.js").ReportReason;
        reporterId: string;
        targetType: ReportTargetType;
        targetId: string;
        details: string | null;
        resolution: string | null;
        resolvedAt: Date | null;
    }>;
    listReports(status?: ReportStatus): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
        reporter: {
            id: string;
            email: string;
            name: string;
        };
        actions: ({
            admin: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            expiresAt: Date | null;
            reason: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            reportId: string;
            adminId: string;
            action: ModerationActionType;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: ReportStatus;
        reason: import("../../generated/prisma/enums.js").ReportReason;
        reporterId: string;
        targetType: ReportTargetType;
        targetId: string;
        details: string | null;
        resolution: string | null;
        resolvedAt: Date | null;
    })[]>;
    dismissReport(adminId: string, reportId: string, reason: string): Promise<{
        success: boolean;
    }>;
    moderate(adminId: string, reportId: string, dto: ModerateReportDto): Promise<{
        success: boolean;
    }>;
    private assertTargetExists;
}
