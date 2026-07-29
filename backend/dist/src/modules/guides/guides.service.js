var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { GuideStatus, GuideVerificationDecision, NotificationType, PricingType, Role, VerificationCheckStatus, } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { GuideReviewDecision, } from './dto/review-guide-application.dto.js';
const publicGuideInclude = {
    user: {
        select: { id: true, name: true, avatarUrl: true, isVerified: true },
    },
};
let GuidesService = class GuidesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findMine(userId) {
        const guide = await this.prisma.guideProfile.findUnique({
            where: { userId },
            include: publicGuideInclude,
        });
        if (!guide)
            throw new NotFoundException('Guide profile not found');
        return guide;
    }
    async updateMine(userId, dto) {
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
                    price: profile.pricingType === PricingType.NONE ? null : profile.price,
                },
            });
        });
        return this.findMine(userId);
    }
    async findOne(id) {
        const guide = await this.prisma.guideProfile.findFirst({
            where: {
                OR: [{ id }, { userId: id }],
                status: GuideStatus.APPROVED,
                verified: true,
                deletedAt: null,
            },
            include: publicGuideInclude,
        });
        if (!guide)
            throw new NotFoundException('Guide not found');
        return guide;
    }
    async apply(userId, dto) {
        const expertise = dto.expertise.map((item) => item.trim()).filter(Boolean);
        const availability = dto.availability
            .map((item) => item.trim())
            .filter(Boolean);
        const languages = Object.fromEntries(Object.entries(dto.languages)
            .map(([language, proficiency]) => [
            language.trim(),
            String(proficiency).trim(),
        ])
            .filter(([language]) => language.length > 0));
        if (expertise.length < 2 || Object.keys(languages).length < 1) {
            throw new BadRequestException('At least two expertise areas and one language are required');
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
                verificationReviews: {
                    take: 5,
                    orderBy: { reviewedAt: 'desc' },
                    include: { reviewer: { select: { id: true, name: true } } },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    applicationReviews(id) {
        return this.prisma.guideVerificationReview.findMany({
            where: { guideProfileId: id },
            include: { reviewer: { select: { id: true, name: true, email: true } } },
            orderBy: { reviewedAt: 'desc' },
        });
    }
    async reviewApplication(reviewerId, id, dto) {
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
        const decisionReason = dto.decisionReason?.trim() || null;
        if (!approved && !decisionReason) {
            throw new BadRequestException('A rejection reason is required');
        }
        if (approved && (dto.documentStatus !== VerificationCheckStatus.VERIFIED ||
            dto.referenceStatus !== VerificationCheckStatus.VERIFIED)) {
            throw new BadRequestException('Document and reference checks must be verified before approval');
        }
        const assessmentScore = Object.values(dto.assessmentBreakdown).reduce((total, score) => total + score, 0);
        const rankPoints = 100 + application.experienceYears * 10 + assessmentScore;
        return this.prisma.$transaction(async (transaction) => {
            const changed = await transaction.guideProfile.updateMany({
                where: { id, status: GuideStatus.PENDING },
                data: {
                    status: approved ? GuideStatus.APPROVED : GuideStatus.REJECTED,
                    verified: approved,
                    assessmentScore,
                    rankPoints,
                },
            });
            if (changed.count !== 1)
                throw new ConflictException('This application has already been reviewed');
            await transaction.guideVerificationReview.create({
                data: {
                    guideProfileId: id,
                    reviewerId,
                    decision: approved ? GuideVerificationDecision.APPROVED : GuideVerificationDecision.REJECTED,
                    decisionReason,
                    internalNote: dto.internalNote?.trim() || null,
                    assessmentScore,
                    assessmentBreakdown: {
                        localKnowledge: dto.assessmentBreakdown.localKnowledge,
                        communication: dto.assessmentBreakdown.communication,
                        safety: dto.assessmentBreakdown.safety,
                        professionalism: dto.assessmentBreakdown.professionalism,
                    },
                    documentStatus: dto.documentStatus,
                    referenceStatus: dto.referenceStatus,
                    applicationSnapshot: {
                        country: application.country,
                        city: application.city,
                        bio: application.bio,
                        experienceYears: application.experienceYears,
                        languages: application.languages,
                        expertise: application.expertise,
                        availability: application.availability,
                        pricingType: application.pricingType,
                        price: application.price?.toString() ?? null,
                        referenceContact: application.referenceContact,
                        codeOfConductAccepted: application.codeOfConductAccepted,
                        submittedAt: application.updatedAt.toISOString(),
                    },
                },
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
            await transaction.notification.create({
                data: {
                    userId: application.userId,
                    type: approved ? NotificationType.GUIDE_APPLICATION_APPROVED : NotificationType.GUIDE_APPLICATION_REJECTED,
                    title: approved ? 'Guide application approved' : 'Guide application rejected',
                    body: approved ? 'Your guide workspace is now available.' : `Your guide application was not approved: ${decisionReason}`,
                    data: { guideProfileId: id },
                },
            });
            return transaction.guideProfile.findUnique({ where: { id }, include: publicGuideInclude });
        });
    }
};
GuidesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], GuidesService);
export { GuidesService };
//# sourceMappingURL=guides.service.js.map