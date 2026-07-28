import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListingCategory, Role } from '../../generated/prisma/client.js';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { SetInventoryDto } from './dto/set-inventory.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { ListingsService } from './listings.service.js';

@ApiTags('listings')
@Controller({ path: 'listings', version: '1' })
export class ListingsController {
  constructor(private readonly listings: ListingsService) {}

  @Public() @Get()
  all(@Query('category') category?: ListingCategory, @Query('search') search?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.listings.findAll({ category, search, page: Number(page || 1), limit: Number(limit || 10) });
  }

  @ApiBearerAuth() @Roles(Role.GUIDE) @Get('mine')
  mine(@CurrentUser() user: RequestUser) { return this.listings.findMine(user.sub); }

  @ApiBearerAuth() @Roles(Role.GUIDE) @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateListingDto) { return this.listings.create(user.sub, dto); }

  @ApiBearerAuth() @Roles(Role.GUIDE) @Patch(':id')
  update(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateListingDto) { return this.listings.update(user.sub, id, dto); }

  @ApiBearerAuth() @Roles(Role.GUIDE) @Post(':id/publish')
  publish(@CurrentUser() user: RequestUser, @Param('id') id: string) { return this.listings.publish(user.sub, id); }

  @ApiBearerAuth() @Roles(Role.GUIDE) @Post(':id/unpublish')
  unpublish(@CurrentUser() user: RequestUser, @Param('id') id: string) { return this.listings.unpublish(user.sub, id); }

  @ApiBearerAuth() @Roles(Role.GUIDE) @Delete(':id')
  archive(@CurrentUser() user: RequestUser, @Param('id') id: string) { return this.listings.archive(user.sub, id); }

  @ApiBearerAuth() @Roles(Role.GUIDE) @Get(':id/inventory')
  inventory(@CurrentUser() user: RequestUser, @Param('id') id: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.listings.inventory(user.sub, id, from, to);
  }

  @ApiBearerAuth() @Roles(Role.GUIDE) @Patch(':id/inventory')
  setInventory(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: SetInventoryDto) {
    return this.listings.setInventory(user.sub, id, dto);
  }

  @Public() @Get(':id')
  one(@Param('id') id: string) { return this.listings.findOne(id); }
}
