import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { Role } from '../../generated/prisma/client.js';
export class RegisterDto {
  @ApiProperty({ example: 'Anu Batsaikhan' }) @IsString() @MinLength(2) @MaxLength(100) name!: string;
  @ApiProperty({ example: 'anu@example.com' }) @IsEmail() email!: string;
  @ApiProperty({ minLength: 8 }) @IsString() @MinLength(8) password!: string;
  @ApiProperty({ enum: Role, default: Role.TRAVELER }) @IsEnum(Role) role: Role = Role.TRAVELER;
}
