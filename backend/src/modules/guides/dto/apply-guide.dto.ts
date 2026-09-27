import {
  Equals,
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumberString,
  IsObject,
  IsString,
  Max,
  MaxLength,
  Matches,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { PricingType } from '../../../generated/prisma/client.js';

export class ApplyGuideDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  country!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city!: string;

  @IsString()
  @MinLength(40)
  @MaxLength(5000)
  bio!: string;

  @IsInt()
  @Min(0)
  @Max(60)
  experienceYears!: number;

  @IsObject()
  languages!: Record<string, string>;

  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(50, { each: true })
  expertise!: string[];

  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  availability!: string[];

  @IsEnum(PricingType)
  pricingType: PricingType = PricingType.HOURLY;

  @ValidateIf((dto: ApplyGuideDto) => dto.pricingType !== PricingType.NONE)
  @IsNumberString()
  @Matches(/^(?=.*[1-9])(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/, { message: 'Price must be a positive amount with at most two decimal places' })
  price?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(300)
  referenceContact!: string;

  @IsBoolean()
  @Equals(true)
  codeOfConductAccepted!: boolean;
}
