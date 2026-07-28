import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator.js';
import { ConversationsService } from './conversations.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
@ApiTags('conversations') @ApiBearerAuth() @Controller({ path: 'conversations', version: '1' })
export class ConversationsController {
  constructor(private readonly conversations: ConversationsService) {}
  @Get() list(@CurrentUser() user: RequestUser) { return this.conversations.list(user.sub); }
  @Get(':id/messages') messages(@CurrentUser() user: RequestUser, @Param('id') id: string) { return this.conversations.messages(user.sub, id); }
  @Post('direct/:userId') direct(@CurrentUser() user: RequestUser, @Param('userId') userId: string) { return this.conversations.direct(user.sub, userId); }
  @Post(':id/messages') send(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: SendMessageDto) { return this.conversations.send(user.sub, id, dto); }
}
