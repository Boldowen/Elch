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
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../../generated/prisma/client.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { ApplyGuideDto } from './dto/apply-guide.dto.js';
import { ReviewGuideApplicationDto } from './dto/review-guide-application.dto.js';
import { UpdateGuideProfileDto } from './dto/update-guide-profile.dto.js';
import { GuidesService } from './guides.service.js';
let GuidesController = class GuidesController {
    guides;
    constructor(guides) {
        this.guides = guides;
    }
    all() {
        return this.guides.findAll();
    }
    ranking() {
        return this.guides.ranking();
    }
    me(user) {
        return this.guides.findMine(user.sub);
    }
    updateMine(user, dto) {
        return this.guides.updateMine(user.sub, dto);
    }
    applications() {
        return this.guides.listApplications();
    }
    review(user, id, dto) {
        return this.guides.reviewApplication(user.sub, id, dto);
    }
    applicationReviews(id) {
        return this.guides.applicationReviews(id);
    }
    apply(user, dto) {
        return this.guides.apply(user.sub, dto);
    }
    one(id) {
        return this.guides.findOne(id);
    }
};
__decorate([
    Public(),
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "all", null);
__decorate([
    Public(),
    Get('ranking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "ranking", null);
__decorate([
    ApiBearerAuth(),
    Get('me'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "me", null);
__decorate([
    ApiBearerAuth(),
    Patch('me'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateGuideProfileDto]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "updateMine", null);
__decorate([
    ApiBearerAuth(),
    Roles(Role.ADMIN),
    Get('applications'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "applications", null);
__decorate([
    ApiBearerAuth(),
    Roles(Role.ADMIN),
    Patch('applications/:id/review'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ReviewGuideApplicationDto]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "review", null);
__decorate([
    ApiBearerAuth(),
    Roles(Role.ADMIN),
    Get('applications/:id/reviews'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "applicationReviews", null);
__decorate([
    ApiBearerAuth(),
    Post('apply'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ApplyGuideDto]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "apply", null);
__decorate([
    Public(),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "one", null);
GuidesController = __decorate([
    ApiTags('guides'),
    Controller({ path: 'guides', version: '1' }),
    __metadata("design:paramtypes", [GuidesService])
], GuidesController);
export { GuidesController };
//# sourceMappingURL=guides.controller.js.map