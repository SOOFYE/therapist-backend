import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AppointmentTypeEnum } from '../enum/appointment-type.enum';

export class GetAppointmentsFilterDto {
  @ApiPropertyOptional({ description: 'Start date in YYYY-MM-DD format' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date in YYYY-MM-DD format' })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Start time in HH:mm:ss format' })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ description: 'End time in HH:mm:ss format' })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ enum: AppointmentTypeEnum, description: 'Type of appointment' })
  @IsEnum(AppointmentTypeEnum)
  @IsOptional()
  appointmentType?: AppointmentTypeEnum;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Sort order for date (asc or desc)',
    default: 'desc',
  })
  @IsString()
  @IsOptional()
  sortByDate?: 'asc' | 'desc';
}