import type { RequestUser } from '../../common/decorators/current-user.decorator.js';
import { NotificationsService } from './notifications.service.js';
export declare class NotificationsController {
    private readonly notifications;
    constructor(notifications: NotificationsService);
    list(user: RequestUser): Promise<{
        items: {
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            type: import("../../generated/prisma/enums.js").NotificationType;
            body: string;
            data: import("@prisma/client/runtime/client").JsonValue | null;
            readAt: Date | null;
        }[];
        unreadCount: number;
    }>;
    markAllRead(user: RequestUser): Promise<{
        updated: number;
    }>;
    markRead(user: RequestUser, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        type: import("../../generated/prisma/enums.js").NotificationType;
        body: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        readAt: Date | null;
    } | null>;
}
