import { RequestUser } from '../../common/decorators/current-user.decorator.js';
import { ConversationsService } from './conversations.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
export declare class ConversationsController {
    private readonly conversations;
    constructor(conversations: ConversationsService);
    list(user: RequestUser): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
        participants: ({
            user: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            userId: string;
            conversationId: string;
            lastReadAt: Date | null;
            joinedAt: Date;
        })[];
        messages: {
            id: string;
            deletedAt: Date | null;
            conversationId: string;
            senderId: string;
            type: import("../../generated/prisma/enums.js").MessageType;
            body: string | null;
            mediaUrl: string | null;
            sentAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string | null;
        bookingId: string | null;
    })[]>;
    messages(user: RequestUser, id: string): Promise<{
        id: string;
        deletedAt: Date | null;
        conversationId: string;
        senderId: string;
        type: import("../../generated/prisma/enums.js").MessageType;
        body: string | null;
        mediaUrl: string | null;
        sentAt: Date;
    }[]>;
    direct(user: RequestUser, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string | null;
        bookingId: string | null;
    }>;
    send(user: RequestUser, id: string, dto: SendMessageDto): Promise<{
        id: string;
        deletedAt: Date | null;
        conversationId: string;
        senderId: string;
        type: import("../../generated/prisma/enums.js").MessageType;
        body: string | null;
        mediaUrl: string | null;
        sentAt: Date;
    }>;
}
