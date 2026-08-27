import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { GuideEvidenceType, Role, VerificationCheckStatus } from '../src/generated/prisma/client.js';
import { GuideEvidenceService } from '../src/modules/guides/guide-evidence.service.js';
import { ObjectStorageService } from '../src/modules/storage/object-storage.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const userId = '11111111-1111-4111-8111-111111111111';
const guideId = '22222222-2222-4222-8222-222222222222';
const evidenceId = '33333333-3333-4333-8333-333333333333';

describe('GuideEvidenceService', () => {
  const storage = {
    maxFileBytes: jest.fn(() => 1024),
    put: jest.fn<() => Promise<void>>(() => Promise.resolve()),
    get: jest.fn(() => Promise.resolve({ key: 'guide-evidence/key.pdf', bytes: Buffer.from('%PDF-test'), contentType: 'application/pdf' })),
    remove: jest.fn<() => Promise<void>>(() => Promise.resolve()),
  } as unknown as ObjectStorageService;

  beforeEach(() => jest.clearAllMocks());

  it('validates file signatures before storing private guide evidence', async () => {
    const prisma = { guideProfile: { findUnique: jest.fn(() => Promise.resolve({ id: guideId })) } } as unknown as PrismaService;
    const service = new GuideEvidenceService(prisma, storage);
    await expect(service.upload(userId, {
      type: GuideEvidenceType.IDENTITY,
      issuer: 'Authority',
      fileName: 'identity.pdf',
      mimeType: 'application/pdf',
      contentBase64: Buffer.from('not-a-pdf').toString('base64'),
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(storage.put).not.toHaveBeenCalled();
  });

  it('stores only a random object reference and integrity metadata', async () => {
    const create = jest.fn(({ data }: { data: Record<string, unknown> }) => Promise.resolve({ id: evidenceId, ...data }));
    const prisma = {
      guideProfile: { findUnique: jest.fn(() => Promise.resolve({ id: guideId })) },
      guideEvidence: { create },
    } as unknown as PrismaService;
    const service = new GuideEvidenceService(prisma, storage);
    await service.upload(userId, {
      type: GuideEvidenceType.FIRST_AID,
      issuer: 'Red Cross',
      fileName: '../first-aid.pdf',
      mimeType: 'application/pdf',
      contentBase64: Buffer.from('%PDF-test').toString('base64'),
    });
    expect(storage.put).toHaveBeenCalledWith(expect.stringMatching(/^guide-evidence\/.+\.pdf$/), expect.any(Buffer), 'application/pdf');
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({
      reference: expect.stringMatching(/^storage:\/\/guide-evidence\//),
      status: VerificationCheckStatus.PENDING,
      metadata: expect.objectContaining({ originalName: '.._first-aid.pdf', sha256: expect.stringMatching(/^[a-f0-9]{64}$/) }),
    }) }));
  });

  it('uses a conditional review update and rejects a repeated decision', async () => {
    const prisma = {
      guideEvidence: {
        findUnique: jest.fn(() => Promise.resolve({ status: VerificationCheckStatus.PENDING, metadata: {} })),
        updateMany: jest.fn(() => Promise.resolve({ count: 0 })),
      },
    } as unknown as PrismaService;
    const service = new GuideEvidenceService(prisma, storage);
    await expect(service.review(userId, evidenceId, { status: VerificationCheckStatus.VERIFIED }))
      .rejects.toBeInstanceOf(ConflictException);
  });

  it('allows only the owner or an admin to download an evidence document', async () => {
    const prisma = {
      guideEvidence: { findUnique: jest.fn(() => Promise.resolve({
        guideProfile: { userId: 'someone-else' },
        metadata: { storageKey: 'guide-evidence/key.pdf', mimeType: 'application/pdf', originalName: 'doc.pdf' },
      })) },
    } as unknown as PrismaService;
    const service = new GuideEvidenceService(prisma, storage);
    await expect(service.download(userId, [Role.GUIDE], evidenceId)).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.download(userId, [Role.ADMIN], evidenceId)).resolves.toMatchObject({ fileName: 'doc.pdf' });
  });
});
