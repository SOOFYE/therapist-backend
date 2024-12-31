import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TherapistAvailabilityService } from './therapist-availability.service';
import { ApiOperation } from '@nestjs/swagger';
import { TherapistAvailabilityEntity } from './entities/therapist-availability.entity';
import { DayOfWeekEnum } from './enum/days-of-week.enum';

@Controller('therapist-availability')
export class TherapistAvailabilityController {
  constructor(private readonly availabilityService: TherapistAvailabilityService) {}

  @Get(':therapistId')
  @ApiOperation({ summary: 'Get therapist availability' })
  async getTherapistAvailability(
    @Param('therapistId') therapistId: string,
  ): Promise<TherapistAvailabilityEntity[]> {
    return this.availabilityService.getTherapistAvailability(therapistId);
  }

  @Put(':therapistId')
  @ApiOperation({ summary: 'Update therapist availability' })
  async updateTherapistAvailability(
    @Param('therapistId') therapistId: string,
    @Body()
    updates: {
      dayOfWeek: DayOfWeekEnum;
      startTime: string;
      endTime: string;
      isActive: boolean;
    }[],
  ): Promise<TherapistAvailabilityEntity[]> {
    return this.availabilityService.updateTherapistAvailability(therapistId, updates);
  }
}
