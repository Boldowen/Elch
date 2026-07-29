import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ListingCategory, ListingStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { SetInventoryDto } from './dto/set-inventory.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { PricingService } from '../pricing/pricing.service.js';

const includeListing = {
  images: { orderBy: { sortOrder: 'asc' as const } },
  host: { select: { id: true, name: true, avatarUrl: true, isVerified: true } },
};

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricing: PricingService,
  ) {}

  findAll(query: { category?: ListingCategory; search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 10));
    const where = {
      deletedAt: null,
      published: true,
      status: ListingStatus.PUBLISHED,
      ...(query.category ? { category: query.category } : {}),
      ...(query.search ? { OR: [
        { title: { contains: query.search, mode: 'insensitive' as const } },
        { location: { contains: query.search, mode: 'insensitive' as const } },
      ] } : {}),
    };
    return Promise.all([
      this.prisma.listing.findMany({ where, include: includeListing, orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }], skip: (page - 1) * limit, take: limit }),
      this.prisma.listing.count({ where }),
    ]).then(([items, total]) => ({ items, meta: { page, limit, total, pages: Math.ceil(total / limit) } }));
  }

  async findOne(id: string) {
    const item = await this.prisma.listing.findFirst({
      where: { OR: [{ id }, { slug: id }], deletedAt: null, published: true, status: ListingStatus.PUBLISHED },
      include: includeListing,
    });
    if (!item) throw new NotFoundException('Listing not found');
    return item;
  }

  findMine(userId: string) {
    return this.prisma.listing.findMany({
      where: { hostId: userId, deletedAt: null },
      include: { images: { orderBy: { sortOrder: 'asc' } }, _count: { select: { bookings: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  create(userId: string, dto: CreateListingDto) {
    const { images, ...data } = dto;
    const slugBase = dto.title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'listing';
    return this.prisma.listing.create({
      data: {
        ...data,
        currency: dto.currency.toUpperCase(),
        price: this.pricing.minorToDecimal(dto.basePriceMinor),
        title: dto.title.trim(),
        location: dto.location.trim(),
        description: dto.description.trim(),
        slug: `${slugBase}-${randomUUID().slice(0, 8)}`,
        hostId: userId,
        status: ListingStatus.DRAFT,
        published: false,
        images: { create: images.map((image, sortOrder) => ({ ...image, alt: image.alt.trim() || dto.title.trim(), sortOrder })) },
      },
      include: includeListing,
    });
  }

  async update(userId: string, id: string, dto: UpdateListingDto) {
    const listing = await this.owned(userId, id);
    if (listing.status === ListingStatus.ARCHIVED) throw new ConflictException('Archived listings cannot be edited');
    const { images, ...data } = dto;
    return this.prisma.listing.update({
      where: { id },
      data: {
        ...data,
        ...(dto.basePriceMinor !== undefined ? { price: this.pricing.minorToDecimal(dto.basePriceMinor) } : {}),
        ...(dto.currency ? { currency: dto.currency.toUpperCase() } : {}),
        title: dto.title?.trim(),
        location: dto.location?.trim(),
        description: dto.description?.trim(),
        ...(images ? { images: { deleteMany: {}, create: images.map((image, sortOrder) => ({ ...image, alt: image.alt.trim() || dto.title?.trim() || listing.title, sortOrder })) } } : {}),
      },
      include: includeListing,
    });
  }

  async publish(userId: string, id: string) {
    const listing = await this.owned(userId, id);
    if (listing.status !== ListingStatus.DRAFT && listing.status !== ListingStatus.PENDING_REVIEW) {
      throw new ConflictException('Only draft listings can be published');
    }
    return this.prisma.listing.update({ where: { id }, data: { status: ListingStatus.PUBLISHED, published: true } });
  }

  async unpublish(userId: string, id: string) {
    const listing = await this.owned(userId, id);
    if (listing.status !== ListingStatus.PUBLISHED) throw new ConflictException('Listing is not published');
    return this.prisma.listing.update({ where: { id }, data: { status: ListingStatus.DRAFT, published: false } });
  }

  async archive(userId: string, id: string) {
    await this.owned(userId, id);
    const active = await this.prisma.booking.count({
      where: { listingId: id, status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }, deletedAt: null },
    });
    if (active) throw new ConflictException('Listing has active bookings and cannot be archived');
    return this.prisma.listing.update({ where: { id }, data: { status: ListingStatus.ARCHIVED, published: false } });
  }

  async inventory(userId: string, id: string, from?: string, to?: string) {
    await this.owned(userId, id);
    return this.prisma.listingInventory.findMany({
      where: {
        listingId: id,
        ...(from || to ? { date: { ...(from ? { gte: this.dateOnly(from) } : {}), ...(to ? { lte: this.dateOnly(to) } : {}) } } : {}),
      },
      orderBy: { date: 'asc' },
    });
  }

  async setInventory(userId: string, id: string, dto: SetInventoryDto) {
    await this.owned(userId, id);
    return this.prisma.$transaction(async (tx) => {
      for (const day of dto.days) {
        const date = this.dateOnly(day.date);
        const existing = await tx.listingInventory.findUnique({ where: { listingId_date: { listingId: id, date } } });
        const reserved = existing?.reservedUnits ?? 0;
        if (day.totalUnits < reserved) throw new ConflictException(`Inventory on ${day.date} already has ${reserved} reserved unit(s)`);
        await tx.listingInventory.upsert({
          where: { listingId_date: { listingId: id, date } },
          create: { listingId: id, date, totalUnits: day.totalUnits, reservedUnits: 0, availableUnits: day.totalUnits },
          update: { totalUnits: day.totalUnits, availableUnits: day.totalUnits - reserved },
        });
      }
      return tx.listingInventory.findMany({ where: { listingId: id, date: { in: dto.days.map((day) => this.dateOnly(day.date)) } }, orderBy: { date: 'asc' } });
    });
  }

  private async owned(userId: string, id: string) {
    const listing = await this.prisma.listing.findFirst({ where: { id, deletedAt: null } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.hostId !== userId) throw new ForbiddenException();
    return listing;
  }

  private dateOnly(value: string) {
    const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) throw new ConflictException('Invalid inventory date');
    return date;
  }
}
