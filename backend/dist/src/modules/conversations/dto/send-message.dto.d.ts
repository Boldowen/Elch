import { MessageType } from '../../../generated/prisma/client.js';
export declare class SendMessageDto {
    type: MessageType;
    body?: string;
    mediaUrl?: string;
}
