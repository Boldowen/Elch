import {
  IsArray,
  ArrayMaxSize,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { PricingType } from '../../../generated/prisma/client.js';

export class UpdateGuideProfileDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100) name?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100) country?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100) city?: string;
  @IsOptional() @IsString() @MinLength(40) @MaxLength(5000) bio?: string;
  @IsOptional() @IsObject() languages?: Record<string, string>;
  @IsOptional() @IsArray() @ArrayMaxSize(20) @IsString({ each: true }) @MinLength(1, { each: true }) @MaxLength(50, { each: true }) expertise?: string[];
  @IsOptional() @IsArray() @ArrayMaxSize(50) @IsString({ each: true }) @MaxLength(100, { each: true }) availability?: string[];
  @IsOptional() @IsEnum(PricingType) pricingType?: PricingType;
  @IsOptional() @IsString()
  @Matches(/^(?=.*[1-9])(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/, { message: 'Price must be a positive amount with at most two decimal places' })
  price?: string;
}
