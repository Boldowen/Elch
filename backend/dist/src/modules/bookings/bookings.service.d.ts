import { BookingStatus, CancellationPolicyType, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { BookingAction } from './dto/update-booking-status.dto.js';
export declare class BookingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listTraveler(userId: string): Prisma.PrismaPromise<({
        listing: ({
            images: {
                id: string;
                listingId: string;
                url: string;
                alt: string | null;
                sortOrder: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            status: import("../../generated/prisma/enums.js").ListingStatus;
            rating: import("@prisma/client-runtime-utils").Decimal;
            reviewCount: number;
            slug: string;
            title: string;
            location: string;
            description: string;
            category: import("../../generated/prisma/enums.js").ListingCategory;
            priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
            datesLabel: string;
            tags: string[];
            amenities: string[];
            published: boolean;
            defaultTotalUnits: number;
            hostId: string;
        }) | null;
        guide: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        expiresAt: Date | null;
        status: BookingStatus;
        listingId: string | null;
        travelerId: string;
        guideId: string | null;
        startsAt: Date;
        endsAt: Date;
        guests: number;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        note: string | null;
        cancellationPolicy: CancellationPolicyType;
        freeCancellationUntil: Date | null;
        lateCancellationPercent: number;
        noShowPercent: number;
        cancellationFee: import("@prisma/client-runtime-utils").Decimal;
        cancelledAt: Date | null;
    })[]>;
    listProvider(userId: string): Prisma.PrismaPromise<({
        listing: ({
            images: {
                id: string;
                listingId: string;
                url: string;
                alt: string | null;
                sortOrder: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            status: import("../../generated/prisma/enums.js").ListingStatus;
            rating: import("@prisma/client-runtime-utils").Decimal;
            reviewCount: number;
            slug: string;
            title: string;
            location: string;
            description: string;
            category: import("../../generated/prisma/enums.js").ListingCategory;
            priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
            datesLabel: string;
            tags: string[];
            amenities: string[];
            published: boolean;
            defaultTotalUnits: number;
            hostId: string;
        }) | null;
        traveler: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        guide: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        expiresAt: Date | null;
        status: BookingStatus;
        listingId: string | null;
        travelerId: string;
        guideId: string | null;
        startsAt: Date;
        endsAt: Date;
        guests: number;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        note: string | null;
        cancellationPolicy: CancellationPolicyType;
        freeCancellationUntil: Date | null;
        lateCancellationPercent: number;
        noShowPercent: number;
        cancellationFee: import("@prisma/client-runtime-utils").Decimal;
        cancelledAt: Date | null;
    })[]>;
    create(userId: string, dto: CreateBookingDto, idempotencyKey?: string): Promise<string | number | true | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray | ({
        listing: ({
            images: {
                id: string;
                listingId: string;
                url: string;
                alt: string | null;
                sortOrder: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            status: import("../../generated/prisma/enums.js").ListingStatus;
            rating: import("@prisma/client-runtime-utils").Decimal;
            reviewCount: number;
            slug: string;
            title: string;
            location: string;
            description: string;
            category: import("../../generated/prisma/enums.js").ListingCategory;
            priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
            datesLabel: string;
            tags: string[];
            amenities: string[];
            published: boolean;
            defaultTotalUnits: number;
            hostId: string;
        }) | null;
        guide: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        expiresAt: Date | null;
        status: BookingStatus;
        listingId: string | null;
        travelerId: string;
        guideId: string | null;
        startsAt: Date;
        endsAt: Date;
        guests: number;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        note: string | null;
        cancellationPolicy: CancellationPolicyType;
        freeCancellationUntil: Date | null;
        lateCancellationPercent: number;
        noShowPercent: number;
        cancellationFee: import("@prisma/client-runtime-utils").Decimal;
        cancelledAt: Date | null;
    })>;
    updateStatus(userId: string, bookingId: string, action: BookingAction): Promise<({
        listing: ({
            images: {
                id: string;
                listingId: string;
                url: string;
                alt: string | null;
                sortOrder: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            status: import("../../generated/prisma/enums.js").ListingStatus;
            rating: import("@prisma/client-runtime-utils").Decimal;
            reviewCount: number;
            slug: string;
            title: string;
            location: string;
            description: string;
            category: import("../../generated/prisma/enums.js").ListingCategory;
            priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
            datesLabel: string;
            tags: string[];
            amenities: string[];
            published: boolean;
            defaultTotalUnits: number;
            hostId: string;
        }) | null;
        guide: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        expiresAt: Date | null;
        status: BookingStatus;
        listingId: string | null;
        travelerId: string;
        guideId: string | null;
        startsAt: Date;
        endsAt: Date;
        guests: number;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        note: string | null;
        cancellationPolicy: CancellationPolicyType;
        freeCancellationUntil: Date | null;
        lateCancellationPercent: number;
        noShowPercent: number;
        cancellationFee: import("@prisma/client-runtime-utils").Decimal;
        cancelledAt: Date | null;
    }) | null>;
    private resolveTransition;
    private replay;
    private unavailable;
    private inventoryDates;
    private reserveListingInventory;
    private releaseListingInventory;
}
