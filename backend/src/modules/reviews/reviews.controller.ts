import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ReviewsService } from './reviews.service.js';

@ApiTags('reviews')
@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Public()
  @Get()
  list(@Query('guideId') guideId?: string, @Query('listingId') listingId?: string) {
    return this.reviews.list({ guideId, listingId });
  }

  @ApiBearerAuth()
  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateReviewDto) {
    return this.reviews.create(user.sub, dto);
  }
}
