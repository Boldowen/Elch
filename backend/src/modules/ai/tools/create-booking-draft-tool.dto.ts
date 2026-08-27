import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsISO8601,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  validateSync,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import type { CreateBookingDto } from '../../bookings/dto/create-booking.dto.js';

class CreateBookingDraftToolArgs {
  @ValidateIf((_, value) => value !== undefined)
  @IsUUID()
  listingId?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsUUID()
  guideId?: string;

  @IsISO8601({ strict: true, strictSeparator: true })
  startsAt!: string;

  @IsISO8601({ strict: true, strictSeparator: true })
  endsAt!: string;

  @IsInt()
  @Min(1)
  @Max(30)
  guests: number = 1;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MaxLength(1000)
  note?: string;

  @IsUUID()
  idempotencyKey!: string;
}

export interface ValidatedBookingDraftToolArgs {
  booking: CreateBookingDto;
  idempotencyKey: string;
}

export function validateBookingDraftToolArgs(
  params: Record<string, unknown>,
): ValidatedBookingDraftToolArgs {
  const input = plainToInstance(CreateBookingDraftToolArgs, params);
  const errors = validateSync(input, {
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    stopAtFirstError: true,
    whitelist: true,
  });
  if (errors.length > 0) invalidParameters();
  if (Boolean(input.listingId) === Boolean(input.guideId)) invalidParameters();

  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(input.endsAt);
  if (
    Number.isNaN(startsAt.getTime()) ||
    Number.isNaN(endsAt.getTime()) ||
    endsAt <= startsAt
  ) {
    invalidParameters();
  }

  return {
    booking: {
      listingId: input.listingId,
      guideId: input.guideId,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      guests: input.guests,
      note: input.note,
    },
    idempotencyKey: input.idempotencyKey,
  };
}

function invalidParameters(): never {
  throw new BadRequestException({
    code: 'AI_TOOL_PARAMETERS_INVALID',
    message: 'createBookingDraft parameters are invalid',
  });
}
