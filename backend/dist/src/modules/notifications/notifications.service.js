var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId) {
        const [items, unreadCount] = await this.prisma.$transaction([
            this.prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 100,
            }),
            this.prisma.notification.count({ where: { userId, readAt: null } }),
        ]);
        return { items, unreadCount };
    }
    async markRead(userId, id) {
        const changed = await this.prisma.notification.updateMany({
            where: { id, userId, readAt: null },
            data: { readAt: new Date() },
        });
        if (changed.count === 0) {
            const exists = await this.prisma.notification.count({ where: { id, userId } });
            if (!exists)
                throw new NotFoundException('Notification not found');
        }
        return this.prisma.notification.findFirst({ where: { id, userId } });
    }
    async markAllRead(userId) {
        const result = await this.prisma.notification.updateMany({
            where: { userId, readAt: null },
            data: { readAt: new Date() },
        });
        return { updated: result.count };
    }
};
NotificationsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], NotificationsService);
export { NotificationsService };
//# sourceMappingURL=notifications.service.js.map