import { Controller, Get, Body, Put, Req, UseGuards } from '@nestjs/common';
import { TherapistAvailabilityService } from './therapist-availability.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TherapistAvailabilityEntity } from './entities/therapist-availability.entity';
import { Roles } from '../common/decorators/role.decorator';
import { ErrorHttpException } from '../common/errors/error-http.exception';
import { RolesGuard } from '../common/guards/role.guard';
import { SuccessResponse } from '../common/sucesses/success-http.response';
import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard';
import { RoleEnum } from '../user/enums/role.enum';
import { Request } from 'express';
import { UpdateTherapistAvailabilityDto } from './dto/update-therapist-availability.dto';


@Controller('therapist-availability')
@ApiTags('therapist-availability')
@ApiBearerAuth()
export class TherapistAvailabilityController {
  constructor(private readonly availabilityService: TherapistAvailabilityService) {}

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.therapist)
  @Get('/my')
  @ApiOperation({ summary: 'Get therapist availability' })
  async getTherapistAvailability(@Req() req: Request): Promise<SuccessResponse<TherapistAvailabilityEntity[]>> {
    try {
      const therapistId = req.user.id;
      const availability = await this.availabilityService.getTherapistAvailability(therapistId);

      if (!availability.length) {
        throw new ErrorHttpException(
          404,
          'Therapist availability not found',
          'Not Found',
          null,
        );
      }

      return new SuccessResponse(200, 'Therapist availability retrieved successfully', availability);
    } catch (error) {
      if (!(error instanceof ErrorHttpException)) {
        throw new ErrorHttpException(
          500,
          'An unexpected error occurred while fetching availability',
          'Internal Server Error',
          error.message,
        );
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.therapist)
  @Put()
  @ApiOperation({ summary: 'Update therapist availability' })
  async updateTherapistAvailability(
    @Req() req: Request,
    @Body() updates: UpdateTherapistAvailabilityDto[],
  ): Promise<SuccessResponse<TherapistAvailabilityEntity[]>> {
    try {
      const therapistId = req.user.id;

      const updatedAvailability = await this.availabilityService.updateTherapistAvailability(therapistId, updates);

      return new SuccessResponse(200, 'Therapist availability updated successfully', updatedAvailability);
    } catch (error) {
      if (!(error instanceof ErrorHttpException)) {
        throw new ErrorHttpException(
          500,
          'An unexpected error occurred while updating availability',
          'Internal Server Error',
          error.message,
        );
      }
      throw error;
    }
  }
}