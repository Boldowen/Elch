import { ListingCategory, ListingStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { SetInventoryDto } from './dto/set-inventory.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
export declare class ListingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        category?: ListingCategory;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: ({
            images: {
                id: string;
                listingId: string;
                url: string;
                alt: string | null;
                sortOrder: number;
            }[];
            host: {
                id: string;
                name: string;
                avatarUrl: string | null;
                isVerified: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            status: ListingStatus;
            rating: import("@prisma/client-runtime-utils").Decimal;
            reviewCount: number;
            slug: string;
            title: string;
            location: string;
            description: string;
            category: ListingCategory;
            priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
            datesLabel: string;
            tags: string[];
            amenities: string[];
            published: boolean;
            defaultTotalUnits: number;
            hostId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<{
        images: {
            id: string;
            listingId: string;
            url: string;
            alt: string | null;
            sortOrder: number;
        }[];
        host: {
            id: string;
            name: string;
            avatarUrl: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        status: ListingStatus;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
        slug: string;
        title: string;
        location: string;
        description: string;
        category: ListingCategory;
        priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
        datesLabel: string;
        tags: string[];
        amenities: string[];
        published: boolean;
        defaultTotalUnits: number;
        hostId: string;
    }>;
    findMine(userId: string): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
        _count: {
            bookings: number;
        };
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
        status: ListingStatus;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
        slug: string;
        title: string;
        location: string;
        description: string;
        category: ListingCategory;
        priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
        datesLabel: string;
        tags: string[];
        amenities: string[];
        published: boolean;
        defaultTotalUnits: number;
        hostId: string;
    })[]>;
    create(userId: string, dto: CreateListingDto): import("../../generated/prisma/models.js").Prisma__ListingClient<{
        images: {
            id: string;
            listingId: string;
            url: string;
            alt: string | null;
            sortOrder: number;
        }[];
        host: {
            id: string;
            name: string;
            avatarUrl: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        status: ListingStatus;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
        slug: string;
        title: string;
        location: string;
        description: string;
        category: ListingCategory;
        priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
        datesLabel: string;
        tags: string[];
        amenities: string[];
        published: boolean;
        defaultTotalUnits: number;
        hostId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    update(userId: string, id: string, dto: UpdateListingDto): Promise<{
        images: {
            id: string;
            listingId: string;
            url: string;
            alt: string | null;
            sortOrder: number;
        }[];
        host: {
            id: string;
            name: string;
            avatarUrl: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        status: ListingStatus;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
        slug: string;
        title: string;
        location: string;
        description: string;
        category: ListingCategory;
        priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
        datesLabel: string;
        tags: string[];
        amenities: string[];
        published: boolean;
        defaultTotalUnits: number;
        hostId: string;
    }>;
    publish(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        status: ListingStatus;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
        slug: string;
        title: string;
        location: string;
        description: string;
        category: ListingCategory;
        priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
        datesLabel: string;
        tags: string[];
        amenities: string[];
        published: boolean;
        defaultTotalUnits: number;
        hostId: string;
    }>;
    unpublish(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        status: ListingStatus;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
        slug: string;
        title: string;
        location: string;
        description: string;
        category: ListingCategory;
        priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
        datesLabel: string;
        tags: string[];
        amenities: string[];
        published: boolean;
        defaultTotalUnits: number;
        hostId: string;
    }>;
    archive(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        status: ListingStatus;
        rating: import("@prisma/client-runtime-utils").Decimal;
        reviewCount: number;
        slug: string;
        title: string;
        location: string;
        description: string;
        category: ListingCategory;
        priceUnit: import("../../generated/prisma/enums.js").PriceUnit;
        datesLabel: string;
        tags: string[];
        amenities: string[];
        published: boolean;
        defaultTotalUnits: number;
        hostId: string;
    }>;
    inventory(userId: string, id: string, from?: string, to?: string): Promise<{
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string;
        totalUnits: number;
        reservedUnits: number;
        availableUnits: number;
    }[]>;
    setInventory(userId: string, id: string, dto: SetInventoryDto): Promise<{
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string;
        totalUnits: number;
        reservedUnits: number;
        availableUnits: number;
    }[]>;
    private owned;
    private dateOnly;
}
