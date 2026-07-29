import { RequestUser } from '../../common/decorators/current-user.decorator.js';
import { ReportStatus } from '../../generated/prisma/client.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { DismissReportDto, ModerateReportDto } from './dto/moderate-report.dto.js';
import { TrustSafetyService } from './trust-safety.service.js';
export declare class UserBlocksController {
    private readonly trust;
    constructor(trust: TrustSafetyService);
    blocked(user: RequestUser): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
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
    block(user: RequestUser, id: string): Promise<{
        blocked: boolean;
    }>;
    unblock(user: RequestUser, id: string): Promise<{
        blocked: boolean;
    }>;
}
export declare class ReportsController {
    private readonly trust;
    constructor(trust: TrustSafetyService);
    create(user: RequestUser, dto: CreateReportDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: ReportStatus;
        reason: import("../../generated/prisma/enums.js").ReportReason;
        reporterId: string;
        targetType: import("../../generated/prisma/enums.js").ReportTargetType;
        targetId: string;
        details: string | null;
        resolution: string | null;
        resolvedAt: Date | null;
    }>;
    list(status?: ReportStatus): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
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
            action: import("../../generated/prisma/enums.js").ModerationActionType;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: ReportStatus;
        reason: import("../../generated/prisma/enums.js").ReportReason;
        reporterId: string;
        targetType: import("../../generated/prisma/enums.js").ReportTargetType;
        targetId: string;
        details: string | null;
        resolution: string | null;
        resolvedAt: Date | null;
    })[]>;
    moderate(user: RequestUser, id: string, dto: ModerateReportDto): Promise<{
        success: boolean;
    }>;
    dismiss(user: RequestUser, id: string, dto: DismissReportDto): Promise<{
        success: boolean;
    }>;
}
