import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  GuideStatus,
  ModerationActionType,
  ReportStatus,
  ReportTargetType,
  UserModerationStatus,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { ModerateReportDto } from './dto/moderate-report.dto.js';

@Injectable()
export class TrustSafetyService {
  constructor(private readonly prisma: PrismaService) {}

  async block(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) throw new BadRequestException('You cannot block yourself');
    const target = await this.prisma.user.count({ where: { id: blockedId, deletedAt: null } });
    if (!target) throw new NotFoundException('User not found');
    await this.prisma.$transaction([
      this.prisma.userBlock.upsert({
        where: { blockerId_blockedId: { blockerId, blockedId } },
        update: {},
        create: { blockerId, blockedId },
      }),
      this.prisma.follow.deleteMany({
        where: { OR: [{ followerId: blockerId, followingId: blockedId }, { followerId: blockedId, followingId: blockerId }] },
      }),
    ]);
    return { blocked: true };
  }

  async unblock(blockerId: string, blockedId: string) {
    await this.prisma.userBlock.deleteMany({ where: { blockerId, blockedId } });
    return { blocked: false };
  }

  listBlocked(userId: string) {
    return this.prisma.userBlock.findMany({
      where: { blockerId: userId },
      include: { blocked: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assertInteractionAllowed(firstUserId: string, secondUserId: string) {
    const blocked = await this.prisma.userBlock.count({
      where: { OR: [
        { blockerId: firstUserId, blockedId: secondUserId },
        { blockerId: secondUserId, blockedId: firstUserId },
      ] },
    });
    if (blocked) throw new ForbiddenException({ code: 'USER_INTERACTION_BLOCKED', message: 'This interaction is not available' });
  }

  async createReport(reporterId: string, dto: CreateReportDto) {
    await this.assertTargetExists(dto.targetType, dto.targetId);
    if (dto.targetType === ReportTargetType.USER && dto.targetId === reporterId) {
      throw new BadRequestException('You cannot report yourself');
    }
    return this.prisma.report.create({
      data: { reporterId, reason: dto.reason, targetType: dto.targetType, targetId: dto.targetId, details: dto.details?.trim() || null },
    });
  }

  listReports(status?: ReportStatus) {
    return this.prisma.report.findMany({
      where: status ? { status } : undefined,
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        actions: { include: { admin: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });
  }

  async dismissReport(adminId: string, reportId: string, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const changed = await tx.report.updateMany({
        where: { id: reportId, status: { in: [ReportStatus.OPEN, ReportStatus.UNDER_REVIEW] } },
        data: { status: ReportStatus.DISMISSED, resolution: reason.trim(), resolvedAt: now },
      });
      if (!changed.count) throw new ConflictException('Report is already closed or does not exist');
      await tx.moderationAction.create({
        data: { reportId, adminId, action: ModerationActionType.REPORT_DISMISS, reason: reason.trim() },
      });
      return { success: true };
    });
  }

  async moderate(adminId: string, reportId: string, dto: ModerateReportDto) {
    return this.prisma.$transaction(async (tx) => {
      const report = await tx.report.findUnique({ where: { id: reportId } });
      if (!report) throw new NotFoundException('Report not found');
      if (report.status === ReportStatus.RESOLVED || report.status === ReportStatus.DISMISSED) {
        throw new ConflictException('Report is already closed');
      }
      const now = new Date();
      let expiresAt: Date | null = null;
      switch (dto.action) {
        case ModerationActionType.REPORT_DISMISS:
          throw new BadRequestException('Use the dismiss endpoint to dismiss a report');
        case ModerationActionType.CONTENT_REMOVE:
          if (report.targetType === ReportTargetType.POST) {
            await tx.post.updateMany({ where: { id: report.targetId, deletedAt: null }, data: { deletedAt: now } });
          } else if (report.targetType === ReportTargetType.MESSAGE) {
            await tx.message.updateMany({ where: { id: report.targetId, deletedAt: null }, data: { deletedAt: now } });
          } else {
            throw new BadRequestException('Content removal requires a post or message report');
          }
          break;
        case ModerationActionType.LISTING_UNPUBLISH:
          if (report.targetType !== ReportTargetType.LISTING) throw new BadRequestException('This action requires a listing report');
          await tx.listing.update({ where: { id: report.targetId }, data: { published: false, status: 'SUSPENDED' } });
          break;
        case ModerationActionType.GUIDE_VERIFICATION_REVOKE: {
          if (report.targetType !== ReportTargetType.GUIDE) throw new BadRequestException('This action requires a guide report');
          const guide = await tx.guideProfile.findFirst({ where: { OR: [{ id: report.targetId }, { userId: report.targetId }] } });
          if (!guide) throw new NotFoundException('Guide not found');
          await tx.guideProfile.update({ where: { id: guide.id }, data: { verified: false, status: GuideStatus.REJECTED } });
          break;
        }
        case ModerationActionType.TEMPORARY_SUSPENSION:
          if (report.targetType !== ReportTargetType.USER || !dto.durationHours) throw new BadRequestException('Temporary suspension requires a user report and duration');
          expiresAt = new Date(now.getTime() + dto.durationHours * 3_600_000);
          await tx.user.update({ where: { id: report.targetId }, data: { moderationStatus: UserModerationStatus.TEMPORARILY_SUSPENDED, suspendedUntil: expiresAt, suspensionReason: dto.reason.trim() } });
          await tx.refreshToken.updateMany({ where: { userId: report.targetId, revokedAt: null }, data: { revokedAt: now } });
          break;
        case ModerationActionType.PERMANENT_SUSPENSION:
          if (report.targetType !== ReportTargetType.USER) throw new BadRequestException('Permanent suspension requires a user report');
          await tx.user.update({ where: { id: report.targetId }, data: { moderationStatus: UserModerationStatus.PERMANENTLY_SUSPENDED, suspendedUntil: null, suspensionReason: dto.reason.trim() } });
          await tx.refreshToken.updateMany({ where: { userId: report.targetId, revokedAt: null }, data: { revokedAt: now } });
          break;
        case ModerationActionType.WARNING:
          break;
      }
      await tx.moderationAction.create({
        data: { reportId, adminId, action: dto.action, reason: dto.reason.trim(), expiresAt, metadata: dto.durationHours ? { durationHours: dto.durationHours } : undefined },
      });
      await tx.report.update({ where: { id: reportId }, data: { status: ReportStatus.RESOLVED, resolution: dto.reason.trim(), resolvedAt: now } });
      return { success: true };
    });
  }

  private async assertTargetExists(type: ReportTargetType, id: string) {
    const exists = await ({
      [ReportTargetType.USER]: () => this.prisma.user.count({ where: { id, deletedAt: null } }),
      [ReportTargetType.LISTING]: () => this.prisma.listing.count({ where: { id, deletedAt: null } }),
      [ReportTargetType.GUIDE]: () => this.prisma.guideProfile.count({ where: { OR: [{ id }, { userId: id }], deletedAt: null } }),
      [ReportTargetType.POST]: () => this.prisma.post.count({ where: { id, deletedAt: null } }),
      [ReportTargetType.MESSAGE]: () => this.prisma.message.count({ where: { id, deletedAt: null } }),
      [ReportTargetType.BOOKING]: () => this.prisma.booking.count({ where: { id, deletedAt: null } }),
    })[type]();
    if (!exists) throw new NotFoundException('Report target not found');
  }
}
