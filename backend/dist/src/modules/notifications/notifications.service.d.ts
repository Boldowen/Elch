import { PrismaService } from '../../prisma/prisma.service.js';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            userId: string;
            type: import("../../generated/prisma/enums.js").NotificationType;
            title: string;
            body: string;
            data: import("@prisma/client/runtime/client").JsonValue | null;
            readAt: Date | null;
        }[];
        unreadCount: number;
    }>;
    markRead(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import("../../generated/prisma/enums.js").NotificationType;
        title: string;
        body: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        readAt: Date | null;
    } | null>;
    markAllRead(userId: string): Promise<{
        updated: number;
    }>;
}
