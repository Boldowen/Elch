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
            mutedAt: Date | null;
        })[];
        messages: {
            id: string;
            deletedAt: Date | null;
            sentAt: Date;
            conversationId: string;
            senderId: string;
            type: import("../../generated/prisma/enums.js").MessageType;
            body: string | null;
            mediaUrl: string | null;
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
        sentAt: Date;
        conversationId: string;
        senderId: string;
        type: import("../../generated/prisma/enums.js").MessageType;
        body: string | null;
        mediaUrl: string | null;
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
        sentAt: Date;
        conversationId: string;
        senderId: string;
        type: import("../../generated/prisma/enums.js").MessageType;
        body: string | null;
        mediaUrl: string | null;
    }>;
    mute(user: RequestUser, id: string): Promise<{
        muted: boolean;
    }>;
    unmute(user: RequestUser, id: string): Promise<{
        muted: boolean;
    }>;
}
