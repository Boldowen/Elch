export declare const Role: {
    readonly TRAVELER: "TRAVELER";
    readonly GUIDE: "GUIDE";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const AuthProvider: {
    readonly EMAIL: "EMAIL";
    readonly GOOGLE: "GOOGLE";
    readonly APPLE: "APPLE";
};
export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];
export declare const GuideStatus: {
    readonly DRAFT: "DRAFT";
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type GuideStatus = (typeof GuideStatus)[keyof typeof GuideStatus];
export declare const ListingCategory: {
    readonly TRENDING: "TRENDING";
    readonly HOTEL: "HOTEL";
    readonly FOODS: "FOODS";
    readonly NATURE: "NATURE";
};
export type ListingCategory = (typeof ListingCategory)[keyof typeof ListingCategory];
export declare const ListingStatus: {
    readonly DRAFT: "DRAFT";
    readonly PENDING_REVIEW: "PENDING_REVIEW";
    readonly PUBLISHED: "PUBLISHED";
    readonly SUSPENDED: "SUSPENDED";
    readonly ARCHIVED: "ARCHIVED";
};
export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];
export declare const PriceUnit: {
    readonly PER_NIGHT: "PER_NIGHT";
    readonly PER_HOUR: "PER_HOUR";
    readonly PER_DAY: "PER_DAY";
    readonly PER_PERSON: "PER_PERSON";
    readonly PER_GROUP: "PER_GROUP";
    readonly PACKAGE: "PACKAGE";
};
export type PriceUnit = (typeof PriceUnit)[keyof typeof PriceUnit];
export declare const BookingStatus: {
    readonly DRAFT: "DRAFT";
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly DECLINED: "DECLINED";
    readonly CANCELLED_BY_TRAVELER: "CANCELLED_BY_TRAVELER";
    readonly CANCELLED_BY_PROVIDER: "CANCELLED_BY_PROVIDER";
    readonly EXPIRED: "EXPIRED";
    readonly NO_SHOW: "NO_SHOW";
    readonly DISPUTED: "DISPUTED";
    readonly REFUND_PENDING: "REFUND_PENDING";
    readonly REFUNDED: "REFUNDED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export declare const BookingActorType: {
    readonly TRAVELER: "TRAVELER";
    readonly PROVIDER: "PROVIDER";
    readonly SYSTEM: "SYSTEM";
    readonly ADMIN: "ADMIN";
};
export type BookingActorType = (typeof BookingActorType)[keyof typeof BookingActorType];
export declare const CancellationPolicyType: {
    readonly FLEXIBLE: "FLEXIBLE";
    readonly MODERATE: "MODERATE";
    readonly STRICT: "STRICT";
    readonly CUSTOM: "CUSTOM";
};
export type CancellationPolicyType = (typeof CancellationPolicyType)[keyof typeof CancellationPolicyType];
export declare const MessageType: {
    readonly TEXT: "TEXT";
    readonly IMAGE: "IMAGE";
    readonly SYSTEM: "SYSTEM";
};
export type MessageType = (typeof MessageType)[keyof typeof MessageType];
export declare const PricingType: {
    readonly HOURLY: "HOURLY";
    readonly PACKAGE: "PACKAGE";
    readonly NONE: "NONE";
};
export type PricingType = (typeof PricingType)[keyof typeof PricingType];
