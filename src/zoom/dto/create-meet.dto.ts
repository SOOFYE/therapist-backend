import { IsString, IsNotEmpty, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateZoomMeetingDto {
  @ApiProperty({
    description: 'Topic of the Zoom meeting',
    example: 'Therapy Session',
  })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({
    description: 'Start time of the meeting in ISO 8601 format',
    example: '2024-12-20T14:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'Duration of the meeting in minutes',
    example: 60,
  })
  @IsNumber()
  @Min(1)
  duration: number;
}
