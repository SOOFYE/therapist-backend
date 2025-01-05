import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'therapist@example.com', 
  })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({
      description: 'Password of the user',
      example: 'securePassword123', 
    })
  
    @IsString()
    @IsNotEmpty()
    password: string;
  }