import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { BookingLifecycleService } from './booking-lifecycle.service.js';
@Module({ controllers: [BookingsController], providers: [BookingsService, BookingLifecycleService] })
export class BookingsModule {}
