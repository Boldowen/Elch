import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ReportReason, ReportTargetType } from '../../../generated/prisma/client.js';

export class CreateReportDto {
  @IsEnum(ReportReason)
  reason!: ReportReason;

  @IsEnum(ReportTargetType)
  targetType!: ReportTargetType;

  @IsUUID()
  targetId!: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  details?: string;
}
