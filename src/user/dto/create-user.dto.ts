import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsPhoneNumber, IsDate, IsEnum } from "class-validator";
import { RoleEnum } from "../enums/role.enum";

export class CreateUserDto {
    @ApiProperty({ description: 'First name of the user', example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @ApiProperty({
      description: 'Middle name of the user (optional)',
      example: 'Michael',
      required: false,
    })
    @IsString()
    @IsOptional()
    middleName?: string;
  
    @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({
      description: 'Phone number of the user',
      example: '+1234567890',
    })
    @IsPhoneNumber(null)
    @IsNotEmpty()
    phoneNumber: string;
  
    @ApiProperty({
      description: 'Password for the user account',
      example: 'securePassword123',
    })
    @IsString()
    password: string;
  
    @ApiProperty({
      description: 'Date of birth of the user',
      example: '1990-01-01',
      type: 'string',
      format: 'date',
    })
    @IsDate()
    @IsNotEmpty()
    dob: Date;
  
    @ApiProperty({
      description: 'Role of the user',
      example: 'therapist',
      enum: RoleEnum,
    })
    @IsEnum(RoleEnum)
    @IsNotEmpty()
    role: RoleEnum;
  }