import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class AssistantQueryDto {
  @IsOptional()
  @IsUUID()
  conversationId?: string;

  @IsString()
  @MaxLength(2000)
  message: string;

  @IsOptional()
  @IsIn(['mn', 'en'])
  language?: 'mn' | 'en';

  @IsOptional()
  @IsString()
  routeId?: string;

  @IsOptional()
  @IsString()
  travelDate?: string;

  @IsOptional()
  @IsIn(['A', 'B', 'C', 'D', 'E'])
  experimentMode?: 'A' | 'B' | 'C' | 'D' | 'E';
}
