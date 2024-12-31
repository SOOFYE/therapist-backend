import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsDateString } from "class-validator";

export class ClientSignUpDto {
    @ApiProperty({ description: 'First name of the client' })
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @ApiProperty({ description: 'Middle name of the client', required: false })
    @IsString()
    @IsOptional()
    middleName?: string;
  
    @ApiProperty({ description: 'Last name of the client' })
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @ApiProperty({ description: 'Email address of the client' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({ description: 'Password for the client' })
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @ApiProperty({ description: 'Phone number of the client' })
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;
  
    @ApiProperty({ description: 'Date of birth of the client' })
    @IsDateString()
    @IsNotEmpty()
    dob: Date;
  }