import { IsEnum } from 'class-validator';

export enum BookingAction {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
  CANCEL = 'CANCEL',
  START = 'START',
  COMPLETE = 'COMPLETE',
  DISPUTE = 'DISPUTE',
}

export class UpdateBookingStatusDto {
  @IsEnum(BookingAction)
  action!: BookingAction;
}
