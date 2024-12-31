import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString, IsEnum } from "class-validator";
import { AppointmentTypeEnum } from "../enum/appointment-type.enum";
import { IsTimeFormat } from "../../common/decorators/time.decorator";
import { Transform } from "class-transformer";

export class CreateAppointmentDto {
    @ApiProperty({ description: 'Date of the appointment (YYYY-MM-DD)', example: '2024-12-20' })
    @IsDateString()
    @IsNotEmpty()
    date: string;
  
    @ApiProperty({ description: 'Start time of the appointment (HH:mm:ss)', example: '14:00:00' })
    @IsString()
    @IsNotEmpty()
    @IsTimeFormat({ message: 'End time must be in the format HH:mm:ss' })
    @Transform(({ value }) => value.padStart(8, '0')) 
    startTime: string;
  
    @ApiProperty({ description: 'End time of the appointment (HH:mm:ss)', example: '15:00:00' })
    @IsString()
    @IsNotEmpty()
    @IsTimeFormat({ message: 'End time must be in the format HH:mm:ss' })
    @Transform(({ value }) => value.padStart(8, '0')) 
    endTime: string;
  
    @ApiProperty({ description: 'Type of the appointment', enum: AppointmentTypeEnum, example: 'in-person' })
    @IsEnum(AppointmentTypeEnum)
    type: AppointmentTypeEnum;
  }