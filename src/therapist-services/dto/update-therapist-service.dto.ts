import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber, Min } from "class-validator";

export class UpdateTherapistServiceDto {
    @ApiPropertyOptional({ description: 'Updated name of the service', example: 'Advanced Counseling Session' })
    @IsOptional()
    @IsString()
    name?: string;
  
    @ApiPropertyOptional({ description: 'Updated price of the service', example: 150.75 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number with up to two decimal places' })
    @Min(0, { message: 'Price must be a positive number' })
    price?: number;
  }