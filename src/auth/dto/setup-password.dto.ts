import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetupPasswordDto {
  @ApiProperty({
    description: 'JWT token sent to the client via email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'New password for the client',
    example: 'strongPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}