import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTherapistServiceDto {
  @ApiProperty({ description: 'Name of the service', example: 'Counseling Session' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Price of the service', example: 100.50 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number with up to two decimal places' })
  @Min(0, { message: 'Price must be a positive number' })
  price: number;

}