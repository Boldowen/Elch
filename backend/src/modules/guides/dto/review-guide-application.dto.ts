import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { VerificationCheckStatus } from '../../../generated/prisma/client.js';

export enum GuideReviewDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export class AssessmentBreakdownDto {
  @IsInt() @Min(0) @Max(25) localKnowledge!: number;
  @IsInt() @Min(0) @Max(25) communication!: number;
  @IsInt() @Min(0) @Max(25) safety!: number;
  @IsInt() @Min(0) @Max(25) professionalism!: number;
}

export class ReviewGuideApplicationDto {
  @IsEnum(GuideReviewDecision)
  decision!: GuideReviewDecision;

  @ValidateIf((dto: ReviewGuideApplicationDto) => dto.decision === GuideReviewDecision.REJECT)
  @IsString()
  @MaxLength(500)
  decisionReason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  internalNote?: string;

  @ValidateNested()
  @Type(() => AssessmentBreakdownDto)
  assessmentBreakdown!: AssessmentBreakdownDto;

  @IsEnum(VerificationCheckStatus)
  documentStatus!: VerificationCheckStatus;

  @IsEnum(VerificationCheckStatus)
  referenceStatus!: VerificationCheckStatus;
}
