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
    basePriceMinor: number;
    cleaningFeeMinor: number;
    serviceFeeMinor: number;
    taxMinor: number;
    extraGuestFeeMinor: number;
    depositMinor: number;
    currency: string;
    priceUnit: PriceUnit;
    datesLabel: string;
    tags: string[];
    amenities: string[];
    defaultTotalUnits: number;
    images: ListingImageDto[];
}
export {};
