import { PrismaService } from '../../prisma/prisma.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
export declare class ConversationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
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
    direct(userId: string, peerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string | null;
        bookingId: string | null;
    }>;
    messages(userId: string, id: string): Promise<{
        id: string;
        deletedAt: Date | null;
        conversationId: string;
        senderId: string;
        type: import("../../generated/prisma/enums.js").MessageType;
        body: string | null;
        mediaUrl: string | null;
        sentAt: Date;
    }[]>;
    send(userId: string, id: string, dto: SendMessageDto): Promise<{
        id: string;
        deletedAt: Date | null;
        conversationId: string;
        senderId: string;
        type: import("../../generated/prisma/enums.js").MessageType;
        body: string | null;
        mediaUrl: string | null;
        sentAt: Date;
    }>;
    private assertMember;
}
