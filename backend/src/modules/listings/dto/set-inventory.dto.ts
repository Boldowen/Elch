import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsDateString, IsInt, Max, Min, ValidateNested } from 'class-validator';

class InventoryDayDto {
  @IsDateString() date!: string;
  @IsInt() @Min(0) @Max(100) totalUnits!: number;
}

export class SetInventoryDto {
  @IsArray()
  @ArrayMaxSize(366)
  @ValidateNested({ each: true })
  @Type(() => InventoryDayDto)
  days!: InventoryDayDto[];
}
