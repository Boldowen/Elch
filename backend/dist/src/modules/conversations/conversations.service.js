var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
let ConversationsService = class ConversationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(userId) { return this.prisma.conversation.findMany({ where: { deletedAt: null, participants: { some: { userId } } }, include: { participants: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } }, messages: { take: 1, orderBy: { sentAt: 'desc' } } }, orderBy: { updatedAt: 'desc' } }); }
    async direct(userId, peerId) {
        if (userId === peerId)
            throw new BadRequestException('Cannot message yourself');
        const peer = await this.prisma.user.findFirst({ where: { id: peerId, deletedAt: null }, select: { id: true } });
        if (!peer)
            throw new NotFoundException('Traveler not found');
        const title = `direct:${[userId, peerId].sort().join(':')}`;
        const existing = await this.prisma.conversation.findFirst({ where: { title, deletedAt: null } });
        if (existing)
            return existing;
        return this.prisma.conversation.create({ data: { title, participants: { create: [{ userId }, { userId: peerId }] } }, include: { participants: true } });
    }
    async messages(userId, id) { await this.assertMember(userId, id); return this.prisma.message.findMany({ where: { conversationId: id, deletedAt: null }, orderBy: { sentAt: 'asc' } }); }
    async send(userId, id, dto) {
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
    async assertMember(userId, id) { const count = await this.prisma.conversationParticipant.count({ where: { conversationId: id, userId } }); if (!count)
        throw new ForbiddenException('Not a participant'); }
};
ConversationsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ConversationsService);
export { ConversationsService };
//# sourceMappingURL=conversations.service.js.map