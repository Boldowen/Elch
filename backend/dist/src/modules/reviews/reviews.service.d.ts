import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { RankingService } from '../ranking/ranking.service.js';
export declare class ReviewsService {
    private readonly prisma;
    private readonly ranking;
    constructor(prisma: PrismaService, ranking: RankingService);
    list(query: {
        guideId?: string;
        listingId?: string;
    }): Prisma.PrismaPromise<({
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
        rating: number;
        listingId: string | null;
        guideId: string | null;
        bookingId: string | null;
        authorId: string;
        text: string;
    })[]>;
    create(authorId: string, dto: CreateReviewDto): Promise<{
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
        rating: number;
        listingId: string | null;
        guideId: string | null;
        bookingId: string | null;
        authorId: string;
        text: string;
    }>;
}
