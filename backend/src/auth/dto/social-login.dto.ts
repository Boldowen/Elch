import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export enum SocialProvider {
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

export class SocialLoginDto {
  @IsEnum(SocialProvider)
  provider: SocialProvider;

  @IsString()
  @MinLength(20)
  identityToken: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
}
