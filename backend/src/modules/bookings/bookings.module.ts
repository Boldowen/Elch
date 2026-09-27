import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { BookingLifecycleService } from './booking-lifecycle.service.js';
import { PricingModule } from '../pricing/pricing.module.js';
import { PaymentArrangementsService } from './payment-arrangements.service.js';
import { RankingModule } from '../ranking/ranking.module.js';
@Module({ imports: [PricingModule, RankingModule], controllers: [BookingsController], providers: [BookingsService, BookingLifecycleService, PaymentArrangementsService], exports: [BookingsService] })
export class BookingsModule {}
