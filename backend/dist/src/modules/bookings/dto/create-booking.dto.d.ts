export declare class CreateBookingDto {
    listingId?: string;
    guideId?: string;
    startsAt: string;
    endsAt: string;
    guests: number;
    note?: string;
}
export declare class UpdateBookingDraftDto {
    listingId?: string;
    guideId?: string;
    startsAt?: string;
    endsAt?: string;
    guests?: number;
    note?: string;
    expectedUpdatedAt?: string;
}
