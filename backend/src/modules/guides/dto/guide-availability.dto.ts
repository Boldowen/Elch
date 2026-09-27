import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsDateString, IsEnum, IsString, Matches, MaxLength, ValidateNested } from 'class-validator';
import { GuideAvailabilityStatus } from '../../../generated/prisma/client.js';

export class GuideAvailabilitySlotDto {
  @IsDateString() @Matches(/T.*(?:Z|[+-]\d{2}:\d{2})$/) startsAt!: string;
  @IsDateString() @Matches(/T.*(?:Z|[+-]\d{2}:\d{2})$/) endsAt!: string;
  @IsString() @MaxLength(100) timeZone!: string;
  @IsEnum(GuideAvailabilityStatus) status!: GuideAvailabilityStatus;
}

export class SetGuideAvailabilityDto {
  @IsArray() @ArrayMaxSize(200) @ValidateNested({ each: true }) @Type(() => GuideAvailabilitySlotDto)
  slots!: GuideAvailabilitySlotDto[];
}
