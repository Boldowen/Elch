import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator';
import { RouteFamily, TourismAuthorityLevel, TourismKnowledgeCategory, TourismSourceType } from '../../../generated/prisma/client.js';

export class CreateTourismSourceDto {
  @IsString() @MaxLength(300) title: string;
  @IsString() @MaxLength(200) organization: string;
  @IsEnum(TourismSourceType) sourceType: TourismSourceType;
  @IsEnum(TourismAuthorityLevel) authorityLevel: TourismAuthorityLevel;
  @IsUrl({ protocols: ['http','https'], require_protocol: true }) url: string;
  @IsString() @MaxLength(16) language: string;
  @IsOptional() @IsDateString() publishedAt?: string;
  @IsOptional() @IsDateString() validFrom?: string;
  @IsOptional() @IsDateString() validTo?: string;
  @IsDateString() lastVerifiedAt: string;
}

export class IngestTourismKnowledgeDto {
  @IsString() sourceId: string;
  @IsString() @MaxLength(300) title: string;
  @IsString() @MaxLength(100000) content: string;
  @IsOptional() @IsString() @MaxLength(120) region?: string;
  @IsOptional() @IsEnum(RouteFamily) routeFamily?: RouteFamily;
  @IsEnum(TourismKnowledgeCategory) category: TourismKnowledgeCategory;
  @IsString() @MaxLength(16) language: string;
  @IsOptional() @IsInt() @Min(200) @Max(3000) chunkSize?: number;
}

export class SearchTourismKnowledgeDto {
  @IsString() @MaxLength(2000) query: string;
  @IsOptional() @IsString() @MaxLength(120) region?: string;
  @IsOptional() @IsEnum(RouteFamily) routeFamily?: RouteFamily;
  @IsOptional() @IsEnum(TourismKnowledgeCategory) category?: TourismKnowledgeCategory;
  @IsOptional() @IsString() @MaxLength(16) language?: string;
  @IsOptional() @IsInt() @Min(1) @Max(20) topK?: number;
}

export class ListTourismSourcesDto {
  @IsOptional() @IsString() @MaxLength(200) query?: string;
  @IsOptional() @IsEnum(TourismAuthorityLevel) authorityLevel?: TourismAuthorityLevel;
  @IsOptional() @IsEnum(TourismSourceType) sourceType?: TourismSourceType;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit: number = 50;
}

export class ReviewTourismSourceDto {
  @IsDateString() lastVerifiedAt: string;
  @IsOptional() @IsDateString() validTo?: string;
  @IsOptional() @IsEnum(TourismAuthorityLevel) authorityLevel?: TourismAuthorityLevel;
  @IsOptional() @IsBoolean() disableKnowledge?: boolean;
}

export class ReviewTourismKnowledgeDto {
  @IsBoolean() active: boolean;
  @IsOptional() @IsDateString() lastVerifiedAt?: string;
}
