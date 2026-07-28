var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
let SocialService = class SocialService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async feed(userId) {
        const posts = await this.prisma.post.findMany({
            where: { deletedAt: null },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                        followers: {
                            where: { followerId: userId },
                            select: { id: true },
                        },
                        following: {
                            where: { followingId: userId },
                            select: { id: true },
                        },
                    },
                },
                images: { orderBy: { sortOrder: 'asc' } },
                likes: { where: { userId }, select: { id: true } },
                comments: {
                    where: { deletedAt: null },
                    take: 3,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: {
                            select: { id: true, name: true, avatarUrl: true },
                        },
                    },
                },
                _count: { select: { likes: true, comments: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return posts.map(({ likes, author, ...post }) => ({
            ...post,
            liked: likes.length > 0,
            author: {
                id: author.id,
                name: author.name,
                avatarUrl: author.avatarUrl,
                following: author.followers.length > 0,
                followsYou: author.following.length > 0,
            },
        }));
    }
    createPost(userId, dto) {
        if (!dto.text.trim() && !dto.imageUrls?.length) {
            throw new BadRequestException('A post needs text or at least one photo');
        }
        return this.prisma.post.create({
            data: {
                authorId: userId,
                text: dto.text.trim(),
                location: dto.location?.trim() || null,
                images: dto.imageUrls?.length
                    ? {
                        create: dto.imageUrls.map((url, sortOrder) => ({
                            url,
                            sortOrder,
                        })),
                    }
                    : undefined,
            },
            include: { images: true },
        });
    }
    async toggleLike(userId, postId) {
        await this.assertPost(postId);
        const existing = await this.prisma.postLike.findUnique({
            where: { postId_userId: { postId, userId } },
        });
        if (existing) {
            await this.prisma.postLike.delete({ where: { id: existing.id } });
            return { liked: false };
        }
        await this.prisma.postLike.create({ data: { postId, userId } });
        return { liked: true };
    }
    async comment(userId, postId, dto) {
        await this.assertPost(postId);
        return this.prisma.postComment.create({
            data: { postId, authorId: userId, text: dto.text.trim() },
            include: {
                author: { select: { id: true, name: true, avatarUrl: true } },
            },
        });
    }
    async toggleFollow(userId, followingId) {
        if (userId === followingId) {
            throw new BadRequestException('You cannot follow yourself');
        }
        const user = await this.prisma.user.findFirst({
            where: { id: followingId, deletedAt: null },
            select: { id: true },
        });
        if (!user)
            throw new NotFoundException('Traveler not found');
        const existing = await this.prisma.follow.findUnique({
            where: { followerId_followingId: { followerId: userId, followingId } },
        });
        if (existing) {
            await this.prisma.follow.delete({ where: { id: existing.id } });
            return { following: false, friends: false };
        }
        await this.prisma.follow.create({ data: { followerId: userId, followingId } });
        const mutual = await this.prisma.follow.count({
            where: { followerId: followingId, followingId: userId },
        });
        return { following: true, friends: mutual > 0 };
    }
    async assertPost(id) {
        const post = await this.prisma.post.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!post)
            throw new NotFoundException('Post not found');
    }
};
SocialService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], SocialService);
export { SocialService };
//# sourceMappingURL=social.service.js.map