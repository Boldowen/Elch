import { type RequestUser } from '../../common/decorators/current-user.decorator.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { SocialService } from './social.service.js';
export declare class SocialController {
    private readonly social;
    constructor(social: SocialService);
    feed(user: RequestUser): Promise<{
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
    createPost(user: RequestUser, dto: CreatePostDto): import("../../generated/prisma/models.js").Prisma__PostClient<{
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
    toggleLike(user: RequestUser, id: string): Promise<{
        liked: boolean;
    }>;
    comment(user: RequestUser, id: string, dto: CreateCommentDto): Promise<{
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
    toggleFollow(user: RequestUser, id: string): Promise<{
        following: boolean;
        friends: boolean;
    }>;
}
