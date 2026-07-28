import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { MessageType } from '../../../generated/prisma/client.js';
export class SendMessageDto { @IsEnum(MessageType) type: MessageType = MessageType.TEXT; @IsOptional() @IsString() @MaxLength(2000) body?: string; @IsOptional() @IsUrl({ protocols: ['https'], require_protocol: true }) mediaUrl?: string; }
