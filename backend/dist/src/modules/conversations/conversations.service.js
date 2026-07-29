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
import { NotificationType } from '../../generated/prisma/client.js';
import { TrustSafetyService } from '../trust-safety/trust-safety.service.js';
let ConversationsService = class ConversationsService {
    prisma;
    trust;
    constructor(prisma, trust) {
        this.prisma = prisma;
        this.trust = trust;
    }
    list(userId) { return this.prisma.conversation.findMany({ where: { deletedAt: null, participants: { some: { userId } } }, include: { participants: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } }, messages: { take: 1, orderBy: { sentAt: 'desc' } } }, orderBy: { updatedAt: 'desc' } }); }
    async direct(userId, peerId) {
        if (userId === peerId)
            throw new BadRequestException('Cannot message yourself');
        const peer = await this.prisma.user.findFirst({ where: { id: peerId, deletedAt: null }, select: { id: true } });
        if (!peer)
            throw new NotFoundException('Traveler not found');
        await this.trust.assertInteractionAllowed(userId, peerId);
        const title = `direct:${[userId, peerId].sort().join(':')}`;
        const existing = await this.prisma.conversation.findFirst({ where: { title, deletedAt: null } });
        if (existing)
            return existing;
        return this.prisma.conversation.create({ data: { title, participants: { create: [{ userId }, { userId: peerId }] } }, include: { participants: true } });
    }
    async messages(userId, id) { await this.assertMember(userId, id); return this.prisma.message.findMany({ where: { conversationId: id, deletedAt: null }, orderBy: { sentAt: 'asc' } }); }
    async send(userId, id, dto) {
        await this.assertMember(userId, id);
        const peers = await this.prisma.conversationParticipant.findMany({
            where: { conversationId: id, userId: { not: userId } },
            select: { userId: true },
        });
        await Promise.all(peers.map(({ userId: peerId }) => this.trust.assertInteractionAllowed(userId, peerId)));
        if (!dto.body?.trim() && !dto.mediaUrl) {
            throw new BadRequestException('A message needs text or an image');
        }
        return this.prisma.$transaction(async (tx) => {
            const msg = await tx.message.create({
                data: {
                    conversationId: id,
                    senderId: userId,
                    type: dto.type,
                    body: dto.body?.trim(),
                    mediaUrl: dto.mediaUrl,
                },
            });
            await tx.conversation.update({ where: { id }, data: { updatedAt: new Date() } });
            const recipients = await tx.conversationParticipant.findMany({
                where: { conversationId: id, userId: { not: userId }, mutedAt: null },
                select: { userId: true },
            });
            if (recipients.length) {
                await tx.notification.createMany({
                    data: recipients.map(({ userId: recipientId }) => ({
                        userId: recipientId,
                        type: NotificationType.NEW_MESSAGE,
                        title: 'New message',
                        body: dto.body?.trim() ? 'You received a new message' : 'You received an image',
                        data: { conversationId: id, messageId: msg.id },
                    })),
                });
            }
            return msg;
        });
    }
    async mute(userId, id, muted) {
        const changed = await this.prisma.conversationParticipant.updateMany({
            where: { conversationId: id, userId },
            data: { mutedAt: muted ? new Date() : null },
        });
        if (!changed.count)
            throw new ForbiddenException('Not a participant');
        return { muted };
    }
    async assertMember(userId, id) { const count = await this.prisma.conversationParticipant.count({ where: { conversationId: id, userId } }); if (!count)
        throw new ForbiddenException('Not a participant'); }
};
ConversationsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService, TrustSafetyService])
], ConversationsService);
export { ConversationsService };
//# sourceMappingURL=conversations.service.js.map