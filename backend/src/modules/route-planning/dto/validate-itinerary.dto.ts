import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min, ValidateNested } from 'class-validator';

export class ItineraryStopDto {
  @IsString()
  poiId: string;

  @IsInt()
  @Min(1)
  @Max(30)
  day: number;

  @IsInt()
  @Min(0)
  @Max(1440)
  activityMinutes: number;
}

export class GuideEligibilityDto {
  @IsString()
  languageLevel: string;

  @IsArray()
  @IsString({ each: true })
  routeBadges: string[];

  @IsArray()
  @IsString({ each: true })
  specialtySkills: string[];

  @IsBoolean()
  firstAidVerified: boolean;

  @IsString()
  legalRole: string;
}

export class ValidateItineraryDto {
  @IsString()
  routeId: string;

  @IsDateString()
  startDate: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => ItineraryStopDto)
  stops: ItineraryStopDto[];

  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(1440)
  maxDailyMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  budgetMinor?: number;

  @IsOptional()
  @IsIn(['ROAD', 'OFF_ROAD', 'TREK', 'BOAT', 'ANY'])
  transportation?: 'ROAD' | 'OFF_ROAD' | 'TREK' | 'BOAT' | 'ANY';

  @IsOptional()
  @IsBoolean()
  permitConfirmed?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => GuideEligibilityDto)
  guide?: GuideEligibilityDto;

  /** Raw guide fields above are candidate data only. HTTP validation resolves this ID from verified records. */
  @IsOptional()
  @IsUUID()
  guideProfileId?: string;

  @IsOptional()
  @IsString()
  guideLanguage?: string;

  @IsOptional()
  @IsBoolean()
  safetyPlanProvided?: boolean;

  @IsOptional()
  @IsBoolean()
  humanApprovalProvided?: boolean;

  /** Persisted safety-plan approval used by HTTP validation for R3/R4 routes. */
  @IsOptional()
  @IsUUID()
  safetyPlanId?: string;
}
