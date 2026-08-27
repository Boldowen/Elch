import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class SafetyPlanItineraryItemDto {
  @IsInt() @Min(1) @Max(90) day: number;
  @IsString() @Length(2, 80) nodeCode: string;
  @IsString() @Length(5, 1000) activity: string;
}

export class SafetyPlanEmergencyContactDto {
  @IsString() @Length(2, 120) name: string;
  @IsString() @Length(2, 120) role: string;
  @IsString() @Length(5, 40) @Matches(/^\+?[0-9 ()-]+$/) phone: string;
}

export class CreateSafetyPlanDto {
  /** Route code or UUID. */
  @IsString() @Length(2, 80) routeId: string;
  @IsUUID() guideProfileId: string;
  @IsString() @Length(5, 180) title: string;
  @IsDateString() tripStartAt: string;
  @IsDateString() tripEndAt: string;

  @IsArray() @ArrayMinSize(2) @ArrayMaxSize(90)
  @ValidateNested({ each: true }) @Type(() => SafetyPlanItineraryItemDto)
  itinerary: SafetyPlanItineraryItemDto[];

  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(10)
  @ValidateNested({ each: true }) @Type(() => SafetyPlanEmergencyContactDto)
  emergencyContacts: SafetyPlanEmergencyContactDto[];

  @IsString() @Length(20, 5000) communicationsPlan: string;
  @IsString() @Length(20, 5000) evacuationPlan: string;
  @IsString() @Length(20, 5000) medicalPlan: string;
  @IsArray() @ArrayMinSize(2) @ArrayMaxSize(100) @IsString({ each: true }) riskMitigations: string[];
  @IsArray() @ArrayMinSize(2) @ArrayMaxSize(200) @IsString({ each: true }) equipmentChecklist: string[];
  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true }) permitReferences?: string[];
}

export class UpdateSafetyPlanDto extends PartialType(
  OmitType(CreateSafetyPlanDto, ['routeId', 'guideProfileId'] as const),
) {}

export class ReviewSafetyPlanDto {
  @IsIn(['APPROVED', 'REJECTED']) decision: 'APPROVED' | 'REJECTED';
  @IsOptional() @IsString() @Length(5, 4000) notes?: string;
}

export class RevokeSafetyPlanDto {
  @IsString() @Length(5, 4000) reason: string;
}
