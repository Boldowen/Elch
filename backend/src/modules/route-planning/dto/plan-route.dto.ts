import { IsArray, IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class PlanRouteDto {
  @IsOptional() @IsString() routeId?: string;
  @IsDateString() startDate: string;
  @IsInt() @Min(1) @Max(30) days: number;
  @IsOptional() @IsInt() @Min(0) budgetMinor?: number;
  @IsOptional() @IsInt() @Min(1) @Max(50) groupSize?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) interests?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) languages?: string[];
  @IsOptional() @IsIn(['low', 'moderate', 'high']) riskTolerance?: 'low' | 'moderate' | 'high';
  @IsOptional() @IsIn(['ROAD', 'OFF_ROAD', 'TREK', 'BOAT', 'ANY']) transportation?: 'ROAD' | 'OFF_ROAD' | 'TREK' | 'BOAT' | 'ANY';
  @IsOptional() @IsNumber() @Min(0) @Max(24) maxDailyHours?: number;
}
