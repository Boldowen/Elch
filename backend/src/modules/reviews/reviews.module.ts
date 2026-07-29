import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller.js';
import { ReviewsService } from './reviews.service.js';
import { RankingModule } from '../ranking/ranking.module.js';

@Module({ imports: [RankingModule], controllers: [ReviewsController], providers: [ReviewsService] })
export class ReviewsModule {}
