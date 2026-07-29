export interface PricingInput {
    basePriceMinor: number;
    units: number;
    guests: number;
    currency: string;
    cleaningFeeMinor?: number;
    serviceFeeMinor?: number;
    taxMinor?: number;
    extraGuestFeeMinor?: number;
    depositMinor?: number;
}
export interface PriceBreakdown {
    baseAmountMinor: number;
    cleaningFeeMinor: number;
    serviceFeeMinor: number;
    taxMinor: number;
    extraGuestFeeMinor: number;
    depositMinor: number;
    amountMinor: number;
    currency: string;
}
export declare class PricingService {
    private readonly databaseIntegerMax;
    calculate(input: PricingInput): PriceBreakdown;
    decimalToMinor(value: {
        toString(): string;
    } | string): number;
    minorToDecimal(minor: number): string;
    percentage(amountMinor: number, percent: number): number;
    private positiveInteger;
    private nonNegativeInteger;
    private safeMultiply;
    private safeAdd;
}
