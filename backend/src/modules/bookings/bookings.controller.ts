import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator.js';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto, UpdateBookingDraftDto } from './dto/create-booking.dto.js';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto.js';
import { ProposePaymentArrangementDto } from './dto/payment-arrangement.dto.js';
import { PaymentArrangementsService } from './payment-arrangements.service.js';

@ApiTags('bookings')
@ApiBearerAuth()
@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
  constructor(private readonly bookings: BookingsService, private readonly payments: PaymentArrangementsService) {}

  @Get()
  list(@CurrentUser() user: RequestUser) {
    return this.bookings.listTraveler(user.sub);
  }

  @Get('provider')
  listProvider(@CurrentUser() user: RequestUser) {
    return this.bookings.listProvider(user.sub);
  }

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateBookingDto, @Headers('idempotency-key') key?: string) {
    return this.bookings.create(user.sub, dto, key);
  }

  @Post('drafts')
  createDraft(@CurrentUser() user: RequestUser, @Body() dto: CreateBookingDto, @Headers('idempotency-key') key?: string) {
    return this.bookings.createDraft(user.sub, dto, key);
  }

  @Get('drafts')
  listDrafts(@CurrentUser() user: RequestUser) {
    return this.bookings.listDrafts(user.sub);
  }

  @Get('drafts/:id')
  getDraft(@CurrentUser() user: RequestUser, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.bookings.getOwned(user.sub, id);
  }

  @Patch('drafts/:id')
  updateDraft(
    @CurrentUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateBookingDraftDto,
  ) {
    return this.bookings.updateDraft(user.sub, id, dto);
  }

  @Delete('drafts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDraft(
    @CurrentUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.bookings.deleteDraft(user.sub, id);
  }

  @Post('drafts/:id/submit')
  @HttpCode(HttpStatus.OK)
  submitDraft(@CurrentUser() user: RequestUser, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.bookings.submitDraft(user.sub, id);
  }

  @Post('quote')
  quote(@CurrentUser() user: RequestUser, @Body() dto: CreateBookingDto) {
    return this.bookings.quote(user.sub, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookings.updateStatus(user.sub, id, dto.action);
  }

  @Post(':id/payment')
  proposePayment(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: ProposePaymentArrangementDto) {
    return this.payments.propose(user.sub, id, dto);
  }

  @Post(':id/payment/agree')
  agreePayment(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.payments.agree(user.sub, id);
  }

  @Post(':id/payment/paid')
  markPaymentPaid(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.payments.markPaid(user.sub, id);
  }
}
