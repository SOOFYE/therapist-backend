import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { DayOfWeekEnum } from '../enum/days-of-week.enum';

export class UpdateTherapistAvailabilityDto {
  @ApiProperty({ enum: DayOfWeekEnum, description: 'Day of the week' })
  @IsEnum(DayOfWeekEnum, { message: 'dayOfWeek must be a valid day of the week' })
  @IsNotEmpty()
  dayOfWeek: DayOfWeekEnum;

  @ApiProperty({ description: 'Start time in HH:mm:ss format', example: '09:00:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'End time in HH:mm:ss format', example: '17:00:00' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ description: 'Is the therapist available on this day?', example: true })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}