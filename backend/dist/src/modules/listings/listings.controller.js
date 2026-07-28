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
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListingCategory, Role } from '../../generated/prisma/client.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { SetInventoryDto } from './dto/set-inventory.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { ListingsService } from './listings.service.js';
let ListingsController = class ListingsController {
    listings;
    constructor(listings) {
        this.listings = listings;
    }
    all(category, search, page, limit) {
        return this.listings.findAll({ category, search, page: Number(page || 1), limit: Number(limit || 10) });
    }
    mine(user) { return this.listings.findMine(user.sub); }
    create(user, dto) { return this.listings.create(user.sub, dto); }
    update(user, id, dto) { return this.listings.update(user.sub, id, dto); }
    publish(user, id) { return this.listings.publish(user.sub, id); }
    unpublish(user, id) { return this.listings.unpublish(user.sub, id); }
    archive(user, id) { return this.listings.archive(user.sub, id); }
    inventory(user, id, from, to) {
        return this.listings.inventory(user.sub, id, from, to);
    }
    setInventory(user, id, dto) {
        return this.listings.setInventory(user.sub, id, dto);
    }
    one(id) { return this.listings.findOne(id); }
};
__decorate([
    Public(),
    Get(),
    __param(0, Query('category')),
    __param(1, Query('search')),
    __param(2, Query('page')),
    __param(3, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "all", null);
__decorate([
    ApiBearerAuth(),
    Roles(Role.GUIDE),
    Get('mine'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "mine", null);
__decorate([
    ApiBearerAuth(),
    Roles(Role.GUIDE),
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateListingDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "create", null);
__decorate([
    ApiBearerAuth(),
    Roles(Role.GUIDE),
    Patch(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateListingDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "update", null);
__decorate([
    ApiBearerAuth(),
    Roles(Role.GUIDE),
    Post(':id/publish'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "publish", null);
__decorate([
    ApiBearerAuth(),
    Roles(Role.GUIDE),
    Post(':id/unpublish'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "unpublish", null);
__decorate([
    ApiBearerAuth(),
    Roles(Role.GUIDE),
    Delete(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "archive", null);
__decorate([
    ApiBearerAuth(),
    Roles(Role.GUIDE),
    Get(':id/inventory'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Query('from')),
    __param(3, Query('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "inventory", null);
__decorate([
    ApiBearerAuth(),
    Roles(Role.GUIDE),
    Patch(':id/inventory'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, SetInventoryDto]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "setInventory", null);
__decorate([
    Public(),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ListingsController.prototype, "one", null);
ListingsController = __decorate([
    ApiTags('listings'),
    Controller({ path: 'listings', version: '1' }),
    __metadata("design:paramtypes", [ListingsService])
], ListingsController);
export { ListingsController };
//# sourceMappingURL=listings.controller.js.map