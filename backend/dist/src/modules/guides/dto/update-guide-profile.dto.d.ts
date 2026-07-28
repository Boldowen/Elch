import { PricingType } from '../../../generated/prisma/client.js';
export declare class UpdateGuideProfileDto {
    name?: string;
    country?: string;
    city?: string;
    bio?: string;
    languages?: Record<string, string>;
    expertise?: string[];
    availability?: string[];
    pricingType?: PricingType;
    price?: string;
}
