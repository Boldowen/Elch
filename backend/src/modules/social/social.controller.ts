import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { SocialService } from './social.service.js';

@ApiTags('social')
@ApiBearerAuth()
@Controller({ path: 'social', version: '1' })
export class SocialController {
  constructor(private readonly social: SocialService) {}

  @Get('feed')
  feed(@CurrentUser() user: RequestUser) {
    return this.social.feed(user.sub);
  }

  @Post('posts')
  createPost(@CurrentUser() user: RequestUser, @Body() dto: CreatePostDto) {
    return this.social.createPost(user.sub, dto);
  }

  @Post('posts/:id/like')
  toggleLike(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.social.toggleLike(user.sub, id);
  }

  @Post('posts/:id/comments')
  comment(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.social.comment(user.sub, id, dto);
  }

  @Post('users/:id/follow')
  toggleFollow(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.social.toggleFollow(user.sub, id);
  }
}
