import { IsEnum, IsInt, IsString, Max, MaxLength, Min, ValidateIf } from 'class-validator';
import { ModerationActionType } from '../../../generated/prisma/client.js';

export class ModerateReportDto {
  @IsEnum(ModerationActionType)
  action!: ModerationActionType;

  @IsString()
  @MaxLength(1000)
  reason!: string;

  @ValidateIf((dto: ModerateReportDto) => dto.action === ModerationActionType.TEMPORARY_SUSPENSION)
  @IsInt()
  @Min(1)
  @Max(8760)
  durationHours?: number;
}

export class DismissReportDto {
  @IsString()
  @MaxLength(1000)
  reason!: string;
}
