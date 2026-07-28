export declare enum BookingAction {
    ACCEPT = "ACCEPT",
    DECLINE = "DECLINE",
    CANCEL = "CANCEL",
    START = "START",
    COMPLETE = "COMPLETE",
    DISPUTE = "DISPUTE"
}
export declare class UpdateBookingStatusDto {
    action: BookingAction;
}
