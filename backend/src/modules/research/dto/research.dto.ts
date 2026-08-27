import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  AiExperimentMode,
  AiRequestType,
  CefrLevel,
  RouteFamily,
} from '../../../generated/prisma/client.js';

export class ListResearchRunsDto {
  @IsOptional()
  @IsEnum(AiExperimentMode)
  experimentMode?: AiExperimentMode;

  @IsOptional()
  @IsEnum(AiRequestType)
  requestType?: AiRequestType;

  @IsOptional()
  @IsEnum(RouteFamily)
  routeFamily?: RouteFamily;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsUUID()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}

export class CreateResearchEvaluationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  factualAccuracy?: number;

  @IsOptional()
  @IsBoolean()
  hallucinationDetected?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  poiValidity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  spatialFeasibility?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temporalFeasibility?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  budgetCompliance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  seasonCompliance?: number;

  @IsOptional()
  @IsBoolean()
  safetyViolation?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  personalizationScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  humanScore?: number;

  @IsOptional()
  @IsBoolean()
  humanPass?: boolean;

  @IsOptional()
  @IsEnum(CefrLevel)
  humanCefr?: CefrLevel;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

export class ResearchExportQueryDto {
  @IsOptional()
  @IsIn(['json', 'csv'])
  format: 'json' | 'csv' = 'json';
}
