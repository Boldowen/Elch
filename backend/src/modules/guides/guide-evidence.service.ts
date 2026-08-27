import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { Role, VerificationCheckStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ObjectStorageService } from '../storage/object-storage.service.js';
import { ReviewGuideEvidenceDto, UploadGuideEvidenceDto } from './dto/guide-evidence.dto.js';

type EvidenceMetadata = {
  storageKey?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  sha256?: string;
  reviewNote?: string | null;
  reviewedById?: string;
  reviewedAt?: string;
};

const evidenceSelect = {
  id: true,
  type: true,
  issuer: true,
  verifiedAt: true,
  expiresAt: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  metadata: true,
};

@Injectable()
export class GuideEvidenceService {
  private readonly logger = new Logger(GuideEvidenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: ObjectStorageService,
  ) {}

  async upload(userId: string, dto: UploadGuideEvidenceDto) {
    const guide = await this.prisma.guideProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!guide) throw new NotFoundException('Guide profile not found');
    if (dto.expiresAt && new Date(dto.expiresAt) <= new Date()) {
      throw new BadRequestException('Evidence expiry must be in the future');
    }
    const bytes = this.decodeAndValidate(dto.contentBase64, dto.mimeType);
    const extension = dto.mimeType === 'application/pdf' ? 'pdf' : dto.mimeType === 'image/png' ? 'png' : 'jpg';
    const key = `guide-evidence/${guide.id}/${randomUUID()}.${extension}`;
    const metadata: EvidenceMetadata = {
      storageKey: key,
      originalName: this.safeFileName(dto.fileName),
      mimeType: dto.mimeType,
      size: bytes.byteLength,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    };
    await this.storage.put(key, bytes, dto.mimeType);
    try {
      const evidence = await this.prisma.guideEvidence.create({
        data: {
          guideProfileId: guide.id,
          type: dto.type,
          issuer: dto.issuer.trim(),
          reference: `storage://${key}`,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          status: VerificationCheckStatus.PENDING,
          metadata,
        },
        select: evidenceSelect,
      });
      return this.present(evidence);
    } catch (error) {
      this.logger.error(JSON.stringify({ event: 'guide_evidence_metadata_create_failed', key }));
      await this.storage.remove(key).catch(() => undefined);
      throw error;
    }
  }

  async listMine(userId: string) {
    const guide = await this.prisma.guideProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!guide) throw new NotFoundException('Guide profile not found');
    const records = await this.prisma.guideEvidence.findMany({
      where: { guideProfileId: guide.id },
      select: evidenceSelect,
      orderBy: { createdAt: 'desc' },
    });
    return records.map((record) => this.present(record));
  }

  async listPending() {
    const records = await this.prisma.guideEvidence.findMany({
      where: { status: VerificationCheckStatus.PENDING },
      select: {
        ...evidenceSelect,
        guideProfile: { select: { id: true, user: { select: { id: true, name: true, email: true } } } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return records.map((record) => this.present(record));
  }

  async review(reviewerId: string, id: string, dto: ReviewGuideEvidenceDto) {
    const evidence = await this.prisma.guideEvidence.findUnique({ where: { id }, select: { metadata: true, status: true } });
    if (!evidence) throw new NotFoundException('Guide evidence not found');
    if (evidence.status !== VerificationCheckStatus.PENDING) {
      throw new ConflictException({ code: 'EVIDENCE_ALREADY_REVIEWED', message: 'Evidence has already been reviewed' });
    }
    const reviewedAt = new Date();
    const existing = this.metadata(evidence.metadata);
    const changed = await this.prisma.guideEvidence.updateMany({
      where: { id, status: VerificationCheckStatus.PENDING },
      data: {
        status: dto.status,
        verifiedAt: dto.status === VerificationCheckStatus.VERIFIED ? reviewedAt : null,
        metadata: {
          ...existing,
          reviewNote: dto.reviewNote?.trim() || null,
          reviewedById: reviewerId,
          reviewedAt: reviewedAt.toISOString(),
        },
      },
    });
    if (changed.count !== 1) {
      throw new ConflictException({ code: 'EVIDENCE_ALREADY_REVIEWED', message: 'Evidence has already been reviewed' });
    }
    this.logger.log(JSON.stringify({ event: 'guide_evidence_reviewed', evidenceId: id, reviewerId, status: dto.status }));
    const updated = await this.prisma.guideEvidence.findUnique({ where: { id }, select: evidenceSelect });
    return updated ? this.present(updated) : null;
  }

  async download(userId: string, roles: string[], id: string) {
    const evidence = await this.prisma.guideEvidence.findUnique({
      where: { id },
      select: { guideProfile: { select: { userId: true } }, metadata: true },
    });
    if (!evidence) throw new NotFoundException('Guide evidence not found');
    if (evidence.guideProfile.userId !== userId && !roles.includes(Role.ADMIN)) throw new ForbiddenException();
    const metadata = this.metadata(evidence.metadata);
    if (!metadata.storageKey || !metadata.mimeType || !metadata.originalName) {
      throw new NotFoundException('Evidence document not found');
    }
    return {
      ...(await this.storage.get(metadata.storageKey, metadata.mimeType)),
      fileName: metadata.originalName,
    };
  }

  private decodeAndValidate(contentBase64: string, mimeType: UploadGuideEvidenceDto['mimeType']) {
    const bytes = Buffer.from(contentBase64, 'base64');
    if (!bytes.length || bytes.byteLength > this.storage.maxFileBytes()) {
      throw new BadRequestException({ code: 'EVIDENCE_FILE_SIZE_INVALID', message: 'Evidence file is empty or too large' });
    }
    const valid = mimeType === 'application/pdf'
      ? bytes.subarray(0, 5).toString('ascii') === '%PDF-'
      : mimeType === 'image/png'
        ? bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
        : bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (!valid) {
      throw new BadRequestException({ code: 'EVIDENCE_FILE_TYPE_INVALID', message: 'Document content does not match its MIME type' });
    }
    return bytes;
  }

  private safeFileName(value: string) {
    const cleaned = [...value.replace(/[\\/]/g, '_')]
      .map((character) => {
        const code = character.charCodeAt(0);
        return code < 32 || code === 127 ? '_' : character;
      })
      .join('')
      .trim();
    if (!cleaned) throw new BadRequestException('Evidence file name is invalid');
    return cleaned.slice(0, 240);
  }

  private metadata(value: unknown): EvidenceMetadata {
    return value && typeof value === 'object' && !Array.isArray(value) ? value as EvidenceMetadata : {};
  }

  private present<T extends { metadata: unknown }>(record: T) {
    const { metadata: rawMetadata, ...safe } = record;
    const metadata = this.metadata(rawMetadata);
    return {
      ...safe,
      metadata: {
        originalName: metadata.originalName,
        mimeType: metadata.mimeType,
        size: metadata.size,
        reviewNote: metadata.reviewNote,
        reviewedAt: metadata.reviewedAt,
      },
    };
  }
}
