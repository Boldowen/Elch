import { ReportReason, ReportTargetType } from '../../../generated/prisma/client.js';
export declare class CreateReportDto {
    reason: ReportReason;
    targetType: ReportTargetType;
    targetId: string;
    details?: string;
}
