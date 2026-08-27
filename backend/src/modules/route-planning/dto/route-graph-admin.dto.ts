import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import {
  CefrLevel,
  GuideLegalRole,
  RouteFamily,
  RouteNodeType,
  RouteRiskLevel,
  RouteTransportMode,
} from '../../../generated/prisma/client.js';

const codePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateResearchRouteDto {
  @IsOptional() @IsUUID() sourceId?: string;
  @IsString() @Length(2, 80) @Matches(codePattern) code: string;
  @IsString() @Length(2, 160) name: string;
  @IsEnum(RouteFamily) routeFamily: RouteFamily;
  @IsString() @Length(10, 5000) description: string;
  @IsInt() @Min(1) @Max(60) minimumDays: number;
  @IsInt() @Min(1) @Max(90) recommendedDays: number;
  @IsEnum(RouteRiskLevel) riskLevel: RouteRiskLevel;
  @IsEnum(CefrLevel) minimumLanguageLevel: CefrLevel;
  @IsString() @Length(2, 80) @Matches(codePattern) routeBadge: string;
  @IsBoolean() firstAidRequired: boolean;
  @IsEnum(GuideLegalRole) requiredGuideLegalRole: GuideLegalRole;
  @IsArray() @ArrayMaxSize(30) @IsString({ each: true }) requiredSpecialtySkills: string[];
  @IsOptional() @IsBoolean() active?: boolean;
}

export class UpdateResearchRouteDto extends PartialType(CreateResearchRouteDto) {}

export class CreateRouteNodeDto {
  @IsOptional() @IsUUID() sourceId?: string;
  @IsOptional() @IsString() @Length(1, 120) destinationId?: string;
  @IsString() @Length(2, 80) @Matches(codePattern) code: string;
  @IsString() @Length(1, 160) nameMn: string;
  @IsString() @Length(1, 160) nameEn: string;
  @IsString() @Length(1, 120) region: string;
  @Type(() => Number) @IsNumber() @Min(-90) @Max(90) latitude: number;
  @Type(() => Number) @IsNumber() @Min(-180) @Max(180) longitude: number;
  @IsOptional() @IsInt() @Min(-500) @Max(9000) altitude?: number;
  @IsEnum(RouteNodeType) nodeType: RouteNodeType;
  @IsOptional() @IsInt() @Min(0) @Max(10000) sequenceHint?: number;
  @IsOptional() @IsInt() @Min(0) @Max(1440) minimumVisitMinutes?: number;
  @IsOptional() @IsObject() seasonalityMetadata?: Record<string, unknown>;
  @IsOptional() @IsObject() accessMetadata?: Record<string, unknown>;
  @IsOptional() @IsObject() safetyMetadata?: Record<string, unknown>;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class UpdateRouteNodeDto extends PartialType(CreateRouteNodeDto) {}

export class CreateRouteEdgeDto {
  @IsUUID() fromNodeId: string;
  @IsUUID() toNodeId: string;
  @IsUUID() sourceId: string;
  @IsString() @Length(2, 100) @Matches(codePattern) code: string;
  @IsEnum(RouteTransportMode) transportMode: RouteTransportMode;
  @Type(() => Number) @IsNumber() @Min(0.01) @Max(100000) distanceKm: number;
  @IsInt() @Min(1) @Max(100000) estimatedTravelMinutes: number;
  @IsOptional() @IsInt() @Min(0) estimatedCostMinor?: number;
  @IsOptional() @IsString() @Matches(/^[A-Z]{3}$/) estimatedCostCurrency?: string;
  @IsOptional() @IsString() @Length(1, 500) terrain?: string;
  @IsEnum(RouteRiskLevel) riskLevel: RouteRiskLevel;
  @IsArray() @ArrayMaxSize(12) @IsInt({ each: true }) @Min(1, { each: true }) @Max(12, { each: true }) openMonths: number[];
  @IsOptional() @IsBoolean() bidirectional?: boolean;
  @IsOptional() @IsBoolean() requiresRoadCheck?: boolean;
  @IsOptional() @IsBoolean() requiresWeatherCheck?: boolean;
  @IsOptional() @IsBoolean() requiresPermitCheck?: boolean;
  @IsOptional() @IsBoolean() requiresGuide?: boolean;
  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true }) requiredGuideCompetencies?: string[];
  @IsOptional() @IsBoolean() emergencyPlanRequired?: boolean;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsDateString() lastVerifiedAt: string;
}

export class UpdateRouteEdgeDto extends PartialType(CreateRouteEdgeDto) {}
