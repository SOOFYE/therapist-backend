import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { AppointmentTypeEnum } from '../enum/appointment-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RescheduleAppointmentDto {
  @ApiProperty({
    description: 'The date of the appointment in YYYY-MM-DD format',
    example: '2025-01-15',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  date: string;

  @ApiProperty({
    description: 'The start time of the appointment in HH:mm format',
    example: '09:30',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Start time must be in HH:mm format' })
  startTime: string;

  @ApiProperty({
    description: 'The end time of the appointment in HH:mm format',
    example: '10:30',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'End time must be in HH:mm format' })
  endTime: string;

  @ApiProperty({
    description: 'The type of appointment (ONLINE or IN_PERSON)',
    enum: AppointmentTypeEnum,
    example: AppointmentTypeEnum.ONLINE,
  })
  @IsNotEmpty()
  @IsEnum(AppointmentTypeEnum, { message: 'Type must be either ONLINE or IN_PERSON' })
  type: AppointmentTypeEnum;
}