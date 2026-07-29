import { RequestUser } from '../../common/decorators/current-user.decorator.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ReviewsService } from './reviews.service.js';
export declare class ReviewsController {
    private readonly reviews;
    constructor(reviews: ReviewsService);
    list(guideId?: string, listingId?: string): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
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
    create(user: RequestUser, dto: CreateReviewDto): Promise<{
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
