import { PricingType } from '../../../generated/prisma/client.js';
export declare class ApplyGuideDto {
    country: string;
    city: string;
    bio: string;
    experienceYears: number;
    languages: Record<string, string>;
    expertise: string[];
    availability: string[];
    pricingType: PricingType;
    price?: string;
    referenceContact: string;
    codeOfConductAccepted: boolean;
}
