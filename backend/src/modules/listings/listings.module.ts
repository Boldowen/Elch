import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller.js';
import { ListingsService } from './listings.service.js';
import { PricingModule } from '../pricing/pricing.module.js';
@Module({ imports: [PricingModule], controllers: [ListingsController], providers: [ListingsService] })
export class ListingsModule {}
