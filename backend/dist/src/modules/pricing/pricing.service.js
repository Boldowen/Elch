var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BadRequestException, Injectable } from '@nestjs/common';
let PricingService = class PricingService {
    databaseIntegerMax = 2_147_483_647;
    calculate(input) {
        this.positiveInteger(input.basePriceMinor, 'basePriceMinor');
        this.positiveInteger(input.units, 'units');
        this.positiveInteger(input.guests, 'guests');
        const currency = input.currency.toUpperCase();
        if (!/^[A-Z]{3}$/.test(currency))
            throw new BadRequestException('Currency must be a 3-letter ISO code');
        const cleaningFeeMinor = this.nonNegativeInteger(input.cleaningFeeMinor ?? 0, 'cleaningFeeMinor');
        const serviceFeeMinor = this.nonNegativeInteger(input.serviceFeeMinor ?? 0, 'serviceFeeMinor');
        const taxMinor = this.nonNegativeInteger(input.taxMinor ?? 0, 'taxMinor');
        const depositMinor = this.nonNegativeInteger(input.depositMinor ?? 0, 'depositMinor');
        const extraGuestRate = this.nonNegativeInteger(input.extraGuestFeeMinor ?? 0, 'extraGuestFeeMinor');
        const baseAmountMinor = this.safeMultiply(input.basePriceMinor, input.units);
        const extraGuestFeeMinor = this.safeMultiply(extraGuestRate, Math.max(0, input.guests - 1), input.units);
        const amountMinor = this.safeAdd(baseAmountMinor, cleaningFeeMinor, serviceFeeMinor, taxMinor, extraGuestFeeMinor, depositMinor);
        return { baseAmountMinor, cleaningFeeMinor, serviceFeeMinor, taxMinor, extraGuestFeeMinor, depositMinor, amountMinor, currency };
    }
    decimalToMinor(value) {
        const match = value.toString().match(/^(\d+)(?:\.(\d{1,2}))?$/);
        if (!match)
            throw new BadRequestException('Money must have at most two decimal places');
        const minor = Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
        if (!Number.isSafeInteger(minor))
            throw new BadRequestException('Money amount is too large');
        return minor;
    }
    minorToDecimal(minor) {
        this.nonNegativeInteger(minor, 'amountMinor');
        return `${Math.floor(minor / 100)}.${String(minor % 100).padStart(2, '0')}`;
    }
    percentage(amountMinor, percent) {
        this.nonNegativeInteger(amountMinor, 'amountMinor');
        this.nonNegativeInteger(percent, 'percent');
        return Math.round((amountMinor * percent) / 100);
    }
    positiveInteger(value, field) {
        if (!Number.isSafeInteger(value) || value <= 0)
            throw new BadRequestException(`${field} must be a positive integer`);
        return value;
    }
    nonNegativeInteger(value, field) {
        if (!Number.isSafeInteger(value) || value < 0)
            throw new BadRequestException(`${field} must be a non-negative integer`);
        return value;
    }
    safeMultiply(...values) {
        const result = values.reduce((total, value) => total * value, 1);
        if (!Number.isSafeInteger(result) || result > this.databaseIntegerMax)
            throw new BadRequestException('Calculated amount is too large');
        return result;
    }
    safeAdd(...values) {
        const result = values.reduce((total, value) => total + value, 0);
        if (!Number.isSafeInteger(result) || result > this.databaseIntegerMax)
            throw new BadRequestException('Calculated amount is too large');
        return result;
    }
};
PricingService = __decorate([
    Injectable()
], PricingService);
export { PricingService };
//# sourceMappingURL=pricing.service.js.map