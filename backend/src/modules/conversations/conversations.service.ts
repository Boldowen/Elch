import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}
  list(userId: string) { return this.prisma.conversation.findMany({ where: { deletedAt: null, participants: { some: { userId } } }, include: { participants: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } }, messages: { take: 1, orderBy: { sentAt: 'desc' } } }, orderBy: { updatedAt: 'desc' } }); }
  async direct(userId: string, peerId: string) {
    if (userId === peerId) throw new BadRequestException('Cannot message yourself');
    const peer = await this.prisma.user.findFirst({ where: { id: peerId, deletedAt: null }, select: { id: true } });
    if (!peer) throw new NotFoundException('Traveler not found');
    const title = `direct:${[userId, peerId].sort().join(':')}`;
    const existing = await this.prisma.conversation.findFirst({ where: { title, deletedAt: null } });
    if (existing) return existing;
    return this.prisma.conversation.create({ data: { title, participants: { create: [{ userId }, { userId: peerId }] } }, include: { participants: true } });
  }
  async messages(userId: string, id: string) { await this.assertMember(userId, id); return this.prisma.message.findMany({ where: { conversationId: id, deletedAt: null }, orderBy: { sentAt: 'asc' } }); }
  async send(userId: string, id: string, dto: SendMessageDto) {
    await this.assertMember(userId, id);
    if (!dto.body?.trim() && !dto.mediaUrl) {
      throw new BadRequestException('A message needs text or an image');
    }
    const msg = await this.prisma.message.create({
      data: {
        conversationId: id,
        senderId: userId,
        type: dto.type,
        body: dto.body?.trim(),
        mediaUrl: dto.mediaUrl,
      },
    });
    await this.prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
    return msg;
  }
  private async assertMember(userId: string, id: string) { const count = await this.prisma.conversationParticipant.count({ where: { conversationId: id, userId } }); if (!count) throw new ForbiddenException('Not a participant'); }
}
