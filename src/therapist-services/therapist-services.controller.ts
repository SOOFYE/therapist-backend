import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TherapistServicesService } from './therapist-services.service';

import { ApiOperation } from '@nestjs/swagger';
import { PaginatedResult } from '../common/interfaces/paginated-results.interface';
import { TherapistServiceEntity } from './entities/therapist-service.entity';

@Controller('therapist-services')
export class TherapistServicesController {
  constructor(private readonly therapistServicesService: TherapistServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a therapist service' })
  async createService(@Body() serviceData: Partial<TherapistServiceEntity>): Promise<TherapistServiceEntity> {
    return this.therapistServicesService.createService(serviceData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a therapist service by ID' })
  async findOneService(@Param('id') id: string): Promise<TherapistServiceEntity> {
    return this.therapistServicesService.findOneService(id);
  }

  @Get()
  @ApiOperation({ summary: 'Find all therapist services' })
  async findManyServices(): Promise<TherapistServiceEntity[]> {
    return this.therapistServicesService.findManyServices();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Find paginated therapist services' })
  async findPaginatedServices(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<PaginatedResult<TherapistServiceEntity>> {
    return this.therapistServicesService.findPaginatedServices(page, limit);
  }
}
