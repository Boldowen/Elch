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
import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { ReportStatus, Role } from '../../generated/prisma/client.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { DismissReportDto, ModerateReportDto } from './dto/moderate-report.dto.js';
import { TrustSafetyService } from './trust-safety.service.js';
let UserBlocksController = class UserBlocksController {
    trust;
    constructor(trust) {
        this.trust = trust;
    }
    blocked(user) { return this.trust.listBlocked(user.sub); }
    block(user, id) { return this.trust.block(user.sub, id); }
    unblock(user, id) { return this.trust.unblock(user.sub, id); }
};
__decorate([
    Get('blocked'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserBlocksController.prototype, "blocked", null);
__decorate([
    Post(':id/block'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UserBlocksController.prototype, "block", null);
__decorate([
    Delete(':id/block'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UserBlocksController.prototype, "unblock", null);
UserBlocksController = __decorate([
    ApiTags('trust-safety'),
    ApiBearerAuth(),
    Controller({ path: 'users', version: '1' }),
    __metadata("design:paramtypes", [TrustSafetyService])
], UserBlocksController);
export { UserBlocksController };
let ReportsController = class ReportsController {
    trust;
    constructor(trust) {
        this.trust = trust;
    }
    create(user, dto) {
        return this.trust.createReport(user.sub, dto);
    }
    list(status) { return this.trust.listReports(status); }
    moderate(user, id, dto) {
        return this.trust.moderate(user.sub, id, dto);
    }
    dismiss(user, id, dto) {
        return this.trust.dismissReport(user.sub, id, dto.reason);
    }
};
__decorate([
    Post(),
    Throttle({ default: { limit: 10, ttl: 3_600_000 } }),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN),
    __param(0, Query('status', new ParseEnumPipe(ReportStatus, { optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "list", null);
__decorate([
    Patch(':id/moderate'),
    Roles(Role.ADMIN),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ModerateReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "moderate", null);
__decorate([
    Patch(':id/dismiss'),
    Roles(Role.ADMIN),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, DismissReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "dismiss", null);
ReportsController = __decorate([
    ApiTags('reports'),
    ApiBearerAuth(),
    Controller({ path: 'reports', version: '1' }),
    __metadata("design:paramtypes", [TrustSafetyService])
], ReportsController);
export { ReportsController };
//# sourceMappingURL=trust-safety.controller.js.map