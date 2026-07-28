import {
  Equals,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { PricingType } from '../../../generated/prisma/client.js';

export class ApplyGuideDto {
  @IsString()
  country!: string;

  @IsString()
  city!: string;

  @IsString()
  @MinLength(40)
  bio!: string;

  @IsInt()
  @Min(0)
  @Max(60)
  experienceYears!: number;

  @IsObject()
  languages!: Record<string, string>;

  @IsArray()
  expertise!: string[];

  @IsArray()
  availability!: string[];

  @IsEnum(PricingType)
  pricingType: PricingType = PricingType.HOURLY;

  @IsOptional()
  @IsNumberString()
  price?: string;

  @IsString()
  @MinLength(6)
  referenceContact!: string;

  @IsBoolean()
  @Equals(true)
  codeOfConductAccepted!: boolean;
}
