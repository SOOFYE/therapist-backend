import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsInt, IsPositive } from "class-validator";

export class ClientAppointmentsPaginationDto {
    @ApiProperty({ description: 'Page number (default: 1)', example: 1, required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    page?: number = 1;
  
    @ApiProperty({ description: 'Number of items per page (default: 10)', example: 10, required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    limit?: number = 10;
  }