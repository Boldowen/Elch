import { IsBase64, IsDateString, IsEnum, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { GuideEvidenceType, VerificationCheckStatus } from '../../../generated/prisma/client.js';

export class UploadGuideEvidenceDto {
  @IsEnum(GuideEvidenceType)
  type: GuideEvidenceType;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  issuer: string;

  @IsString()
  @MinLength(1)
  @MaxLength(240)
  fileName: string;

  @IsIn(['application/pdf', 'image/jpeg', 'image/png'])
  mimeType: 'application/pdf' | 'image/jpeg' | 'image/png';

  @IsBase64()
  @MaxLength(8_000_000)
  contentBase64: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class ReviewGuideEvidenceDto {
  @IsIn([VerificationCheckStatus.VERIFIED, VerificationCheckStatus.FAILED])
  status: VerificationCheckStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reviewNote?: string;
}
