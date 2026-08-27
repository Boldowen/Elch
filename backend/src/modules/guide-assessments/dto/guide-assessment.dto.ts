import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { AssessmentCategory, AssessmentDifficulty, AssessmentQuestionType, AssessmentReviewDecision, AssessmentType, CefrLevel, RouteFamily } from '../../../generated/prisma/client.js';

export class StartAssessmentDto {
  @IsEnum(AssessmentType) assessmentType: AssessmentType;
  @IsOptional() @IsEnum(RouteFamily) routeFamily?: RouteFamily;
  @IsOptional() @IsString() @MaxLength(16) language?: string;
}

export class SaveAssessmentResponseDto {
  @IsString() questionId: string;
  @IsOptional() @IsString() @MaxLength(12000) responseText?: string;
  @IsOptional() @IsObject() responsePayload?: Record<string, unknown>;
  @IsOptional() @IsString() @MaxLength(500) audioReference?: string;
}

export class HumanReviewDto {
  @IsEnum(AssessmentReviewDecision) decision: AssessmentReviewDecision;
  @IsOptional() @IsNumber() @Min(0) @Max(100) humanScore?: number;
  @IsOptional() @IsBoolean() humanPassed?: boolean;
  @IsOptional() @IsEnum(CefrLevel) humanCefr?: CefrLevel;
  @IsOptional() @IsString() @MaxLength(4000) notes?: string;
}

export class CreateAssessmentQuestionDto {
  @IsEnum(AssessmentCategory) category: AssessmentCategory;
  @IsOptional() @IsEnum(RouteFamily) routeFamily?: RouteFamily;
  @IsEnum(AssessmentDifficulty) difficulty: AssessmentDifficulty;
  @IsString() @MaxLength(16) language: string;
  @IsEnum(AssessmentQuestionType) questionType: AssessmentQuestionType;
  @IsString() @MaxLength(12000) prompt: string;
  @IsOptional() @IsArray() @ArrayMaxSize(20) @IsString({ each: true }) responseOptions?: string[];
  @IsObject() answerKey: Record<string, unknown>;
  @IsObject() scoringRubric: Record<string, unknown>;
  @IsUUID() sourceId: string;
}

export class EvaluateLanguageDto {
  @IsString() @MaxLength(32) language: string;
  @IsBoolean() consentToAiProcessing: boolean;
  // Compatibility only. The service deliberately evaluates saved attempt responses.
  @IsOptional() @IsString() @MaxLength(20000) transcript?: string;
}
