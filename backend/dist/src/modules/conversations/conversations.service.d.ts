import { PrismaService } from '../../prisma/prisma.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { TrustSafetyService } from '../trust-safety/trust-safety.service.js';
export declare class ConversationsService {
    private readonly prisma;
    private readonly trust;
    constructor(prisma: PrismaService, trust: TrustSafetyService);
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
            mutedAt: Date | null;
        })[];
        messages: {
            id: string;
            deletedAt: Date | null;
            sentAt: Date;
            type: import("../../generated/prisma/enums.js").MessageType;
            conversationId: string;
            senderId: string;
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
        sentAt: Date;
        type: import("../../generated/prisma/enums.js").MessageType;
        conversationId: string;
        senderId: string;
        body: string | null;
        mediaUrl: string | null;
    }[]>;
    send(userId: string, id: string, dto: SendMessageDto): Promise<{
        id: string;
        deletedAt: Date | null;
        sentAt: Date;
        type: import("../../generated/prisma/enums.js").MessageType;
        conversationId: string;
        senderId: string;
        body: string | null;
        mediaUrl: string | null;
    }>;
    mute(userId: string, id: string, muted: boolean): Promise<{
        muted: boolean;
    }>;
    private assertMember;
}
