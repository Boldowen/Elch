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
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ConversationsService } from './conversations.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
let ConversationsController = class ConversationsController {
    conversations;
    constructor(conversations) {
        this.conversations = conversations;
    }
    list(user) { return this.conversations.list(user.sub); }
    messages(user, id) { return this.conversations.messages(user.sub, id); }
    direct(user, userId) { return this.conversations.direct(user.sub, userId); }
    send(user, id, dto) { return this.conversations.send(user.sub, id, dto); }
    mute(user, id) { return this.conversations.mute(user.sub, id, true); }
    unmute(user, id) { return this.conversations.mute(user.sub, id, false); }
};
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "list", null);
__decorate([
    Get(':id/messages'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "messages", null);
__decorate([
    Post('direct/:userId'),
    __param(0, CurrentUser()),
    __param(1, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "direct", null);
__decorate([
    Post(':id/messages'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, SendMessageDto]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "send", null);
__decorate([
    Post(':id/mute'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "mute", null);
__decorate([
    Delete(':id/mute'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "unmute", null);
ConversationsController = __decorate([
    ApiTags('conversations'),
    ApiBearerAuth(),
    Controller({ path: 'conversations', version: '1' }),
    __metadata("design:paramtypes", [ConversationsService])
], ConversationsController);
export { ConversationsController };
//# sourceMappingURL=conversations.controller.js.map