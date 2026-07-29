import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { TrustSafetyService } from '../trust-safety/trust-safety.service.js';
export declare class SocialService {
    private readonly prisma;
    private readonly trust;
    constructor(prisma: PrismaService, trust: TrustSafetyService);
    feed(userId: string): Promise<{
        liked: boolean;
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
            following: boolean;
            followsYou: boolean;
        };
        comments: ({
            author: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            authorId: string;
            text: string;
            postId: string;
        })[];
        _count: {
            comments: number;
            likes: number;
        };
        images: {
            id: string;
            url: string;
            sortOrder: number;
            postId: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        location: string | null;
        authorId: string;
        text: string;
    }[]>;
    createPost(userId: string, dto: CreatePostDto): import("../../generated/prisma/models.js").Prisma__PostClient<{
        images: {
            id: string;
            url: string;
            sortOrder: number;
            postId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        location: string | null;
        authorId: string;
        text: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    toggleLike(userId: string, postId: string): Promise<{
        liked: boolean;
    }>;
    comment(userId: string, postId: string, dto: CreateCommentDto): Promise<{
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        authorId: string;
        text: string;
        postId: string;
    }>;
    toggleFollow(userId: string, followingId: string): Promise<{
        following: boolean;
        friends: boolean;
    }>;
    private assertPost;
}
