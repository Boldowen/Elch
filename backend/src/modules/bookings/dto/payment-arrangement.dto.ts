import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaymentArrangement } from '../../../generated/prisma/client.js';

export class ProposePaymentArrangementDto {
  @IsEnum(PaymentArrangement)
  arrangement!: PaymentArrangement;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  instructions?: string;
}
