import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuideStatus, PricingType, Role } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ApplyGuideDto } from './dto/apply-guide.dto.js';
import {
  GuideReviewDecision,
  ReviewGuideApplicationDto,
} from './dto/review-guide-application.dto.js';
import { UpdateGuideProfileDto } from './dto/update-guide-profile.dto.js';

const publicGuideInclude = {
  user: {
    select: { id: true, name: true, avatarUrl: true, isVerified: true },
  },
};

@Injectable()
export class GuidesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.guideProfile.findMany({
      where: {
        status: GuideStatus.APPROVED,
        verified: true,
        deletedAt: null,
      },
      include: publicGuideInclude,
      orderBy: [{ rating: 'desc' }, { experienceYears: 'desc' }],
    });
  }

  ranking() {
    return this.prisma.guideProfile.findMany({
      where: {
        status: GuideStatus.APPROVED,
        verified: true,
        deletedAt: null,
      },
      include: publicGuideInclude,
      orderBy: [{ rankPoints: 'desc' }, { rating: 'desc' }],
      take: 100,
    });
  }

  async findMine(userId: string) {
    const guide = await this.prisma.guideProfile.findUnique({
      where: { userId },
      include: publicGuideInclude,
    });
    if (!guide) throw new NotFoundException('Guide profile not found');
    return guide;
  }

  async updateMine(userId: string, dto: UpdateGuideProfileDto) {
    await this.findMine(userId);
    const { name, ...profile } = dto;
    await this.prisma.$transaction(async (transaction) => {
      if (name) {
        await transaction.user.update({
          where: { id: userId },
          data: { name: name.trim() },
        });
      }
      await transaction.guideProfile.update({
        where: { userId },
        data: {
          ...profile,
          bio: profile.bio?.trim(),
          country: profile.country?.trim(),
          city: profile.city?.trim(),
          price:
            profile.pricingType === PricingType.NONE ? null : profile.price,
        },
      });
    });
    return this.findMine(userId);
  }

  async findOne(id: string) {
    const guide = await this.prisma.guideProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
        status: GuideStatus.APPROVED,
        verified: true,
        deletedAt: null,
      },
      include: publicGuideInclude,
    });
    if (!guide) throw new NotFoundException('Guide not found');
    return guide;
  }

  async apply(userId: string, dto: ApplyGuideDto) {
    const expertise = dto.expertise.map((item) => item.trim()).filter(Boolean);
    const availability = dto.availability
      .map((item) => item.trim())
      .filter(Boolean);
    const languages = Object.fromEntries(
      Object.entries(dto.languages)
        .map(([language, proficiency]) => [
          language.trim(),
          String(proficiency).trim(),
        ])
        .filter(([language]) => language.length > 0),
    );
    if (expertise.length < 2 || Object.keys(languages).length < 1) {
      throw new BadRequestException(
        'At least two expertise areas and one language are required',
      );
    }

    const existing = await this.prisma.guideProfile.findUnique({
      where: { userId },
    });
    if (existing?.status === GuideStatus.APPROVED) {
      throw new ConflictException('This guide profile is already approved');
    }

    return this.prisma.guideProfile.upsert({
      where: { userId },
      create: {
        userId,
        country: dto.country.trim(),
        city: dto.city.trim(),
        bio: dto.bio.trim(),
        experienceYears: dto.experienceYears,
        languages,
        expertise,
        availability,
        pricingType: dto.pricingType,
        price: dto.pricingType === PricingType.NONE ? null : dto.price,
        referenceContact: dto.referenceContact.trim(),
        codeOfConductAccepted: true,
        status: GuideStatus.PENDING,
        verified: false,
        assessmentScore: 0,
        rankPoints: 100 + dto.experienceYears * 10,
      },
      update: {
        country: dto.country.trim(),
        city: dto.city.trim(),
        bio: dto.bio.trim(),
        experienceYears: dto.experienceYears,
        languages,
        expertise,
        availability,
        pricingType: dto.pricingType,
        price: dto.pricingType === PricingType.NONE ? null : dto.price,
        referenceContact: dto.referenceContact.trim(),
        codeOfConductAccepted: true,
        status: GuideStatus.PENDING,
        verified: false,
        assessmentScore: 0,
        rankPoints: 100 + dto.experienceYears * 10,
      },
      include: publicGuideInclude,
    });
  }

  listApplications() {
    return this.prisma.guideProfile.findMany({
      where: { status: GuideStatus.PENDING, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async reviewApplication(id: string, dto: ReviewGuideApplicationDto) {
    const application = await this.prisma.guideProfile.findUnique({
      where: { id },
      include: { user: { select: { roles: true } } },
    });
    if (!application || application.deletedAt) {
      throw new NotFoundException('Guide application not found');
    }
    if (application.status !== GuideStatus.PENDING) {
      throw new ConflictException('This application has already been reviewed');
    }

    const approved = dto.decision === GuideReviewDecision.APPROVE;
    const assessmentScore = approved ? (dto.assessmentScore ?? 0) : 0;
    const rankPoints =
      100 + application.experienceYears * 10 + assessmentScore;

    return this.prisma.$transaction(async (transaction) => {
      const profile = await transaction.guideProfile.update({
        where: { id },
        data: {
          status: approved ? GuideStatus.APPROVED : GuideStatus.REJECTED,
          verified: approved,
          assessmentScore,
          rankPoints,
        },
        include: publicGuideInclude,
      });
      if (approved) {
        await transaction.user.update({
          where: { id: application.userId },
          data: {
            roles: {
              set: [...new Set([...application.user.roles, Role.GUIDE])],
            },
            isVerified: true,
          },
        });
      }
      return profile;
    });
  }
}
