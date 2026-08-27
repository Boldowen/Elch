import { Type } from 'class-transformer';
import { IsISO8601, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class PerformanceScoresDto {
  @IsNumber() @Min(0) @Max(100) communication: number;
  @IsNumber() @Min(0) @Max(100) groupSafety: number;
  @IsNumber() @Min(0) @Max(100) explanationStructure: number;
  @IsNumber() @Min(0) @Max(100) factualPresentation: number;
  @IsNumber() @Min(0) @Max(100) touristCare: number;
  @IsNumber() @Min(0) @Max(100) questionHandling: number;
  @IsNumber() @Min(0) @Max(100) professionalism: number;
}

export class KnowledgeScoresDto {
  @IsNumber() @Min(0) @Max(100) historyArchaeology: number;
  @IsNumber() @Min(0) @Max(100) religionCulture: number;
  @IsNumber() @Min(0) @Max(100) geographyNature: number;
  @IsNumber() @Min(0) @Max(100) lawEthics: number;
  @IsNumber() @Min(0) @Max(100) societyEconomy: number;
}

export class ScoreCompetencyDto {
  @ValidateNested() @Type(() => PerformanceScoresDto) performance: PerformanceScoresDto;
  @ValidateNested() @Type(() => KnowledgeScoresDto) knowledge: KnowledgeScoresDto;
  @IsOptional() @IsNumber() @Min(0) @Max(1) confidence?: number;
}

export class MatchGuidesDto {
  @IsString() routeId: string;
  @IsString() language: string;
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) minimumLanguageLevel: string;
  @IsOptional() @IsISO8601() requestedStartAt?: string;
  @IsOptional() @IsISO8601() requestedEndAt?: string;
  @IsOptional() @IsInt() @Min(1) @Max(50) limit?: number;
}
