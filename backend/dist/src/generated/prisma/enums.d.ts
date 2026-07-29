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
export declare const GuideVerificationDecision: {
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type GuideVerificationDecision = (typeof GuideVerificationDecision)[keyof typeof GuideVerificationDecision];
export declare const VerificationCheckStatus: {
    readonly PENDING: "PENDING";
    readonly VERIFIED: "VERIFIED";
    readonly FAILED: "FAILED";
    readonly NOT_PROVIDED: "NOT_PROVIDED";
};
export type VerificationCheckStatus = (typeof VerificationCheckStatus)[keyof typeof VerificationCheckStatus];
export declare const UserModerationStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly TEMPORARILY_SUSPENDED: "TEMPORARILY_SUSPENDED";
    readonly PERMANENTLY_SUSPENDED: "PERMANENTLY_SUSPENDED";
};
export type UserModerationStatus = (typeof UserModerationStatus)[keyof typeof UserModerationStatus];
export declare const ReportReason: {
    readonly SPAM: "SPAM";
    readonly HARASSMENT: "HARASSMENT";
    readonly SCAM: "SCAM";
    readonly UNSAFE_GUIDE_BEHAVIOR: "UNSAFE_GUIDE_BEHAVIOR";
    readonly FAKE_LISTING: "FAKE_LISTING";
    readonly INAPPROPRIATE_CONTENT: "INAPPROPRIATE_CONTENT";
    readonly PAYMENT_FRAUD: "PAYMENT_FRAUD";
    readonly OTHER: "OTHER";
};
export type ReportReason = (typeof ReportReason)[keyof typeof ReportReason];
export declare const ReportTargetType: {
    readonly USER: "USER";
    readonly LISTING: "LISTING";
    readonly GUIDE: "GUIDE";
    readonly POST: "POST";
    readonly MESSAGE: "MESSAGE";
    readonly BOOKING: "BOOKING";
};
export type ReportTargetType = (typeof ReportTargetType)[keyof typeof ReportTargetType];
export declare const ReportStatus: {
    readonly OPEN: "OPEN";
    readonly UNDER_REVIEW: "UNDER_REVIEW";
    readonly RESOLVED: "RESOLVED";
    readonly DISMISSED: "DISMISSED";
};
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];
export declare const ModerationActionType: {
    readonly REPORT_DISMISS: "REPORT_DISMISS";
    readonly CONTENT_REMOVE: "CONTENT_REMOVE";
    readonly WARNING: "WARNING";
    readonly TEMPORARY_SUSPENSION: "TEMPORARY_SUSPENSION";
    readonly PERMANENT_SUSPENSION: "PERMANENT_SUSPENSION";
    readonly LISTING_UNPUBLISH: "LISTING_UNPUBLISH";
    readonly GUIDE_VERIFICATION_REVOKE: "GUIDE_VERIFICATION_REVOKE";
};
export type ModerationActionType = (typeof ModerationActionType)[keyof typeof ModerationActionType];
export declare const PaymentArrangement: {
    readonly CASH_ON_ARRIVAL: "CASH_ON_ARRIVAL";
    readonly BANK_TRANSFER: "BANK_TRANSFER";
    readonly PROVIDER_TERMINAL: "PROVIDER_TERMINAL";
    readonly ONLINE_PAYMENT: "ONLINE_PAYMENT";
};
export type PaymentArrangement = (typeof PaymentArrangement)[keyof typeof PaymentArrangement];
export declare const PaymentStatus: {
    readonly NOT_REQUIRED: "NOT_REQUIRED";
    readonly PENDING: "PENDING";
    readonly AGREED: "AGREED";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
    readonly REFUND_PENDING: "REFUND_PENDING";
    readonly REFUNDED: "REFUNDED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
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
export declare const NotificationType: {
    readonly BOOKING_CREATED: "BOOKING_CREATED";
    readonly BOOKING_ACCEPTED: "BOOKING_ACCEPTED";
    readonly BOOKING_DECLINED: "BOOKING_DECLINED";
    readonly BOOKING_CANCELLED: "BOOKING_CANCELLED";
    readonly BOOKING_STARTED: "BOOKING_STARTED";
    readonly BOOKING_COMPLETED: "BOOKING_COMPLETED";
    readonly BOOKING_EXPIRED: "BOOKING_EXPIRED";
    readonly NEW_MESSAGE: "NEW_MESSAGE";
    readonly GUIDE_APPLICATION_APPROVED: "GUIDE_APPLICATION_APPROVED";
    readonly GUIDE_APPLICATION_REJECTED: "GUIDE_APPLICATION_REJECTED";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
export declare const PricingType: {
    readonly HOURLY: "HOURLY";
    readonly PACKAGE: "PACKAGE";
    readonly NONE: "NONE";
};
export type PricingType = (typeof PricingType)[keyof typeof PricingType];
