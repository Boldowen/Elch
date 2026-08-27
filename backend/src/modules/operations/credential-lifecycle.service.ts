import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  FirstAidCertificateStatus,
  GuideCompetencyStatus,
  PracticalVerificationStatus,
  VerificationCheckStatus,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class CredentialLifecycleService {
  private readonly logger = new Logger(CredentialLifecycleService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR, { name: 'credential-and-source-expiry' })
  async handleCron() {
    await this.runOnce(new Date());
  }

  async runOnce(now: Date) {
    const [
      evidence,
      routeCompetencies,
      competencies,
      firstAid,
      guideProfiles,
      knowledge,
      idempotencyKeys,
      emailTokens,
      passwordTokens,
      refreshTokens,
    ] = await this.prisma.$transaction([
      this.prisma.guideEvidence.updateMany({
        where: { status: VerificationCheckStatus.VERIFIED, expiresAt: { lte: now } },
        data: { status: VerificationCheckStatus.EXPIRED },
      }),
      this.prisma.guideRouteCompetency.updateMany({
        where: {
          status: { in: [GuideCompetencyStatus.HUMAN_VERIFIED, GuideCompetencyStatus.DOCUMENT_VERIFIED] },
          expiresAt: { lte: now },
        },
        data: { status: GuideCompetencyStatus.EXPIRED },
      }),
      this.prisma.guideCompetency.updateMany({
        where: {
          status: { in: [GuideCompetencyStatus.HUMAN_VERIFIED, GuideCompetencyStatus.DOCUMENT_VERIFIED] },
          validTo: { lte: now },
        },
        data: { status: GuideCompetencyStatus.EXPIRED },
      }),
      this.prisma.guideFirstAid.updateMany({
        where: {
          expiresAt: { lte: now },
          OR: [
            { certificateStatus: FirstAidCertificateStatus.DOCUMENT_VERIFIED },
            { practicalVerificationStatus: PracticalVerificationStatus.VERIFIED },
          ],
        },
        data: {
          certificateStatus: FirstAidCertificateStatus.EXPIRED,
          practicalVerificationStatus: PracticalVerificationStatus.EXPIRED,
        },
      }),
      this.prisma.guideProfile.updateMany({
        where: {
          firstAidVerified: true,
          firstAidRecords: {
            none: {
              certificateStatus: FirstAidCertificateStatus.DOCUMENT_VERIFIED,
              practicalVerificationStatus: PracticalVerificationStatus.VERIFIED,
              OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
            },
          },
        },
        data: { firstAidVerified: false },
      }),
      this.prisma.tourismKnowledge.updateMany({
        where: { active: true, source: { validTo: { lte: now } } },
        data: { active: false },
      }),
      this.prisma.idempotencyKey.deleteMany({ where: { expiresAt: { lte: now } } }),
      this.prisma.emailVerificationToken.deleteMany({ where: { expiresAt: { lte: now } } }),
      this.prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lte: now } } }),
      this.prisma.refreshToken.deleteMany({ where: { expiresAt: { lte: now } } }),
    ]);
    const result = {
      at: now.toISOString(),
      expired: {
        evidence: evidence.count,
        routeCompetencies: routeCompetencies.count,
        competencies: competencies.count,
        firstAid: firstAid.count,
        guideProfiles: guideProfiles.count,
        tourismKnowledge: knowledge.count,
      },
      deleted: {
        idempotencyKeys: idempotencyKeys.count,
        emailVerificationTokens: emailTokens.count,
        passwordResetTokens: passwordTokens.count,
        refreshTokens: refreshTokens.count,
      },
    };
    if (Object.values(result.expired).some(Boolean) || Object.values(result.deleted).some(Boolean)) {
      this.logger.log(JSON.stringify({ event: 'credential_and_source_expiry_completed', ...result }));
    }
    return result;
  }
}
