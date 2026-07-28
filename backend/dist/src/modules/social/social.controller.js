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
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { SocialService } from './social.service.js';
let SocialController = class SocialController {
    social;
    constructor(social) {
        this.social = social;
    }
    feed(user) {
        return this.social.feed(user.sub);
    }
    createPost(user, dto) {
        return this.social.createPost(user.sub, dto);
    }
    toggleLike(user, id) {
        return this.social.toggleLike(user.sub, id);
    }
    comment(user, id, dto) {
        return this.social.comment(user.sub, id, dto);
    }
    toggleFollow(user, id) {
        return this.social.toggleFollow(user.sub, id);
    }
};
__decorate([
    Get('feed'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocialController.prototype, "feed", null);
__decorate([
    Post('posts'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreatePostDto]),
    __metadata("design:returntype", void 0)
], SocialController.prototype, "createPost", null);
__decorate([
    Post('posts/:id/like'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SocialController.prototype, "toggleLike", null);
__decorate([
    Post('posts/:id/comments'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateCommentDto]),
    __metadata("design:returntype", void 0)
], SocialController.prototype, "comment", null);
__decorate([
    Post('users/:id/follow'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SocialController.prototype, "toggleFollow", null);
SocialController = __decorate([
    ApiTags('social'),
    ApiBearerAuth(),
    Controller({ path: 'social', version: '1' }),
    __metadata("design:paramtypes", [SocialService])
], SocialController);
export { SocialController };
//# sourceMappingURL=social.controller.js.map