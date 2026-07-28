import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PricingType } from '../../../generated/prisma/client.js';

export class UpdateGuideProfileDto {
  @IsOptional() @IsString() @MinLength(2) name?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() @MinLength(40) bio?: string;
  @IsOptional() @IsObject() languages?: Record<string, string>;
  @IsOptional() @IsArray() expertise?: string[];
  @IsOptional() @IsArray() availability?: string[];
  @IsOptional() @IsEnum(PricingType) pricingType?: PricingType;
  @IsOptional() @IsString() price?: string;
}
