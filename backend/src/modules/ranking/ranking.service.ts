import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingStatus, ModerationActionType, Prisma, ReportStatus, ReportTargetType } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface RankingMetrics {
  rating: number;
  reviewCount: number;
  globalRating: number;
  completedTrips: number;
  responseRate: number;
  acceptanceRate: number;
  daysSinceActivity: number;
  assessmentScore: number;
  providerCancellations: number;
  confirmedReports: number;
}

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}

  calculate(metrics: RankingMetrics) {
    const priorWeight = 5;
    const bayesianRating = ((metrics.reviewCount * metrics.rating) + (priorWeight * metrics.globalRating)) / (metrics.reviewCount + priorWeight);
    const qualityPoints = (bayesianRating / 5) * 400;
    const tripPoints = Math.min(200, (Math.log1p(metrics.completedTrips) / Math.log(101)) * 200);
    const responsePoints = this.clamp(metrics.responseRate, 0, 100);
    const acceptancePoints = this.clamp(metrics.acceptanceRate, 0, 100);
    const activityPoints = Math.max(0, 100 - this.clamp(metrics.daysSinceActivity, 0, 100));
    const assessmentPoints = this.clamp(metrics.assessmentScore, 0, 100) * 0.5;
    const cancellationPenalty = Math.min(250, metrics.providerCancellations * 50);
    const reportPenalty = Math.min(300, metrics.confirmedReports * 100);
    const rankPoints = Math.max(0, Math.round(
      qualityPoints + tripPoints + responsePoints + acceptancePoints + activityPoints + assessmentPoints - cancellationPenalty - reportPenalty,
    ));
    return { rankPoints, bayesianRating, qualityPoints, tripPoints, responsePoints, acceptancePoints, activityPoints, assessmentPoints, cancellationPenalty, reportPenalty };
  }

  @Cron(CronExpression.EVERY_HOUR, { name: 'guide-ranking-recalculation' })
  async recalculateAll() {
    const guides = await this.prisma.guideProfile.findMany({ where: { deletedAt: null }, select: { userId: true } });
    const results = await Promise.all(guides.map(({ userId }) => this.recalculateGuide(userId)));
    return { recalculated: results.length };
  }

  async recalculateGuide(userId: string, now = new Date()) {
    const guide = await this.prisma.guideProfile.findUnique({
      where: { userId },
      include: { user: { select: { lastLoginAt: true } } },
    });
    if (!guide) return null;
    const providerWhere: Prisma.BookingWhereInput = { OR: [{ guideId: userId }, { listing: { hostId: userId } }], deletedAt: null };
    const [globalReview, decidedBookings, providerCancellations, confirmedReports, latestBooking] = await Promise.all([
      this.prisma.review.aggregate({ where: { bookingId: { not: null }, deletedAt: null }, _avg: { rating: true } }),
      this.prisma.booking.findMany({
        where: { ...providerWhere, status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED, BookingStatus.DECLINED, BookingStatus.EXPIRED, BookingStatus.CANCELLED_BY_TRAVELER, BookingStatus.CANCELLED_BY_PROVIDER, BookingStatus.DISPUTED, BookingStatus.REFUND_PENDING, BookingStatus.REFUNDED] } },
        select: { status: true },
      }),
      this.prisma.booking.count({ where: { ...providerWhere, status: BookingStatus.CANCELLED_BY_PROVIDER } }),
      this.prisma.report.count({
        where: {
          status: ReportStatus.RESOLVED,
          OR: [
            { targetType: ReportTargetType.USER, targetId: userId },
            { targetType: ReportTargetType.GUIDE, targetId: { in: [userId, guide.id] } },
          ],
          actions: { some: { action: { notIn: [ModerationActionType.WARNING, ModerationActionType.REPORT_DISMISS] } } },
        },
      }),
      this.prisma.booking.findFirst({ where: providerWhere, orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
    ]);
    const responded = decidedBookings.filter(({ status }) => status !== BookingStatus.EXPIRED).length;
    const accepted = decidedBookings.filter(({ status }) => status !== BookingStatus.EXPIRED && status !== BookingStatus.DECLINED).length;
    const responseRate = decidedBookings.length ? Math.round((responded * 100) / decidedBookings.length) : 100;
    const acceptanceRate = decidedBookings.length ? Math.round((accepted * 100) / decidedBookings.length) : 100;
    const lastActivity = [guide.updatedAt, guide.user.lastLoginAt, latestBooking?.updatedAt].filter((date): date is Date => Boolean(date)).reduce((latest, date) => date > latest ? date : latest, guide.createdAt);
    const daysSinceActivity = Math.max(0, Math.floor((now.getTime() - lastActivity.getTime()) / 86_400_000));
    const score = this.calculate({
      rating: Number(guide.rating),
      reviewCount: guide.reviewCount,
      globalRating: Number(globalReview._avg.rating ?? 4),
      completedTrips: guide.completedTrips,
      responseRate,
      acceptanceRate,
      daysSinceActivity,
      assessmentScore: guide.assessmentScore,
      providerCancellations,
      confirmedReports,
    });
    return this.prisma.guideProfile.update({
      where: { userId },
      data: { rankPoints: score.rankPoints, responseRate, acceptanceRate, providerCancellationCount: providerCancellations, confirmedReportCount: confirmedReports, rankingUpdatedAt: now },
    });
  }

  private clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
}
