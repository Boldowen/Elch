var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto, UpdateBookingDraftDto } from './dto/create-booking.dto.js';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto.js';
import { ProposePaymentArrangementDto } from './dto/payment-arrangement.dto.js';
import { PaymentArrangementsService } from './payment-arrangements.service.js';
let BookingsController = class BookingsController {
    bookings;
    payments;
    constructor(bookings, payments) {
        this.bookings = bookings;
        this.payments = payments;
    }
    list(user) {
        return this.bookings.listTraveler(user.sub);
    }
    listProvider(user) {
        return this.bookings.listProvider(user.sub);
    }
    create(user, dto, key) {
        return this.bookings.create(user.sub, dto, key);
    }
    createDraft(user, dto, key) {
        return this.bookings.createDraft(user.sub, dto, key);
    }
    listDrafts(user) {
        return this.bookings.listDrafts(user.sub);
    }
    getDraft(user, id) {
        return this.bookings.getOwned(user.sub, id);
    }
    updateDraft(user, id, dto) {
        return this.bookings.updateDraft(user.sub, id, dto);
    }
    async deleteDraft(user, id) {
        await this.bookings.deleteDraft(user.sub, id);
    }
    submitDraft(user, id) {
        return this.bookings.submitDraft(user.sub, id);
    }
    quote(user, dto) {
        return this.bookings.quote(user.sub, dto);
    }
    updateStatus(user, id, dto) {
        return this.bookings.updateStatus(user.sub, id, dto.action);
    }
    proposePayment(user, id, dto) {
        return this.payments.propose(user.sub, id, dto);
    }
    agreePayment(user, id) {
        return this.payments.agree(user.sub, id);
    }
    markPaymentPaid(user, id) {
        return this.payments.markPaid(user.sub, id);
    }
};
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "list", null);
__decorate([
    Get('provider'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "listProvider", null);
__decorate([
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __param(2, Headers('idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateBookingDto, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "create", null);
__decorate([
    Post('drafts'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __param(2, Headers('idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateBookingDto, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "createDraft", null);
__decorate([
    Get('drafts'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "listDrafts", null);
__decorate([
    Get('drafts/:id'),
    __param(0, CurrentUser()),
    __param(1, Param('id', new ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "getDraft", null);
__decorate([
    Patch('drafts/:id'),
    __param(0, CurrentUser()),
    __param(1, Param('id', new ParseUUIDPipe({ version: '4' }))),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateBookingDraftDto]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "updateDraft", null);
__decorate([
    Delete('drafts/:id'),
    HttpCode(HttpStatus.NO_CONTENT),
    __param(0, CurrentUser()),
    __param(1, Param('id', new ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "deleteDraft", null);
__decorate([
    Post('drafts/:id/submit'),
    HttpCode(HttpStatus.OK),
    __param(0, CurrentUser()),
    __param(1, Param('id', new ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "submitDraft", null);
__decorate([
    Post('quote'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateBookingDto]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "quote", null);
__decorate([
    Patch(':id/status'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateBookingStatusDto]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "updateStatus", null);
__decorate([
    Post(':id/payment'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ProposePaymentArrangementDto]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "proposePayment", null);
__decorate([
    Post(':id/payment/agree'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "agreePayment", null);
__decorate([
    Post(':id/payment/paid'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "markPaymentPaid", null);
BookingsController = __decorate([
    ApiTags('bookings'),
    ApiBearerAuth(),
    Controller({ path: 'bookings', version: '1' }),
    __metadata("design:paramtypes", [BookingsService, PaymentArrangementsService])
], BookingsController);
export { BookingsController };
//# sourceMappingURL=bookings.controller.js.map