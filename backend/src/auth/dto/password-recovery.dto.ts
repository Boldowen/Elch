import { IsEmail, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  @Length(64, 64)
  token!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(STRONG_PASSWORD, { message: 'Password must include uppercase, lowercase, and a number' })
  newPassword!: string;
}

export class ChangePasswordDto {
  @IsString()
  @MaxLength(64)
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(STRONG_PASSWORD, { message: 'Password must include uppercase, lowercase, and a number' })
  newPassword!: string;
}
