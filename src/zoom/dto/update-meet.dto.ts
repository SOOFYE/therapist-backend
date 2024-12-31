import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsDateString, IsNumber, Min } from "class-validator";

export class UpdateZoomMeetingDto {
    @ApiProperty({
      description: 'The new topic of the Zoom meeting',
      example: 'Updated Therapy Session',
      required: false,
    })
    @IsString()
    @IsOptional()
    topic?: string;
  
    @ApiProperty({
      description: 'The new start time of the Zoom meeting in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)',
      example: '2024-12-22T15:00:00Z',
      required: false,
    })
    @IsDateString()
    @IsOptional()
    startTime?: string;
  
    @ApiProperty({
      description: 'The new duration of the Zoom meeting in minutes',
      example: 90,
      required: false,
    })
    @IsNumber()
    @Min(1)
    @IsOptional()
    duration?: number;
  }