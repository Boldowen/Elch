import { ModerationActionType } from '../../../generated/prisma/client.js';
export declare class ModerateReportDto {
    action: ModerationActionType;
    reason: string;
    durationHours?: number;
}
export declare class DismissReportDto {
    reason: string;
}
