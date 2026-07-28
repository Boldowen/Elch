import { ListingCategory, PriceUnit } from '../../../generated/prisma/client.js';
declare class ListingImageDto {
    url: string;
    alt: string;
}
export declare class CreateListingDto {
    title: string;
    location: string;
    description: string;
    category: ListingCategory;
    price: number;
    priceUnit: PriceUnit;
    datesLabel: string;
    tags: string[];
    amenities: string[];
    defaultTotalUnits: number;
    images: ListingImageDto[];
}
export {};
