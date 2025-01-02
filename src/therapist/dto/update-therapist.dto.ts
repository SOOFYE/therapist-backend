import { IsString, IsArray, IsOptional, IsEmail, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTherapistDto {
  @ApiProperty({ description: 'Country of the therapist', example: 'USA' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Preferred languages of the therapist', example: ['English', 'Spanish'] })
  @IsArray()
  preferredLanguages: string[];

  @ApiProperty({ description: 'Preferred currency for payments', example: 'USD' })
  @IsString()
  preferredCurrency: string;

  @ApiProperty({ description: 'Time zone of the therapist', example: 'America/Los_Angeles' })
  @IsString()
  timeZone: string;

  @ApiProperty({ description: 'Office location of the therapist', example: 'Los Angeles, CA' })
  @IsString()
  officeLocation: string;

  @ApiProperty({ description: 'Work email of the therapist', example: 'therapist@example.com' })
  @IsString()
  workEmail: string;

  @ApiProperty({ description: 'First name of the therapist', example: 'John' })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ description: 'Middle name of the therapist (optional)', example: 'M.' })
  @IsString()
  @IsOptional()
  middleName: string;

  @ApiProperty({ description: 'Last name of the therapist', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Email address of the therapist', example: 'therapist@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number of the therapist', example: '+1234567890' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Date of birth of the therapist', example: '1980-01-01' })
  @IsDateString()
  dob: string;
}