import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ListingCategory, PriceUnit } from '../../../generated/prisma/client.js';

class ListingImageDto {
  @IsUrl({ protocols: ['https'], require_protocol: true })
  url!: string;

  @IsString()
  @MaxLength(300)
  alt: string = '';
}

export class CreateListingDto {
  @IsString() @MinLength(3) @MaxLength(140) title!: string;
  @IsString() @MinLength(2) @MaxLength(100) location!: string;
  @IsString() @MinLength(20) @MaxLength(5000) description!: string;
  @IsEnum(ListingCategory) category!: ListingCategory;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0.01) price!: number;
  @IsEnum(PriceUnit) priceUnit!: PriceUnit;
  @IsString() @MaxLength(100) datesLabel: string = 'Flexible dates';
  @IsArray() @ArrayMaxSize(20) @IsString({ each: true }) tags: string[] = [];
  @IsArray() @ArrayMaxSize(50) @IsString({ each: true }) amenities: string[] = [];
  @IsInt() @Min(1) @Max(100) defaultTotalUnits: number = 1;
  @IsArray() @ArrayMaxSize(10) @ValidateNested({ each: true }) @Type(() => ListingImageDto)
  images: ListingImageDto[] = [];
}
