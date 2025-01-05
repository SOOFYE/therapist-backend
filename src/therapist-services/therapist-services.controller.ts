import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { TherapistServicesService } from './therapist-services.service';

import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaginatedResult } from '../common/interfaces/paginated-results.interface';
import { TherapistServiceEntity } from './entities/therapist-service.entity';
import { CreateTherapistServiceDto } from './dto/create-therapist-service.dto';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/role.guard';
import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard';
import { RoleEnum } from '../user/enums/role.enum';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { ErrorHttpException } from '../common/errors/error-http.exception';
import { TherapistService } from '../therapist/therapist.service';
import { TherapistEntity } from '../therapist/entities/therapist.entity';
import { UpdateTherapistServiceDto } from './dto/update-therapist-service.dto';

@Controller('therapist-services')
@ApiBearerAuth()
export class TherapistServicesController {
  constructor(
    private readonly therapistServicesService: TherapistServicesService,
    private readonly therapistService: TherapistService
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.therapist)
  @Post()
  @ApiOperation({ summary: 'Create a therapist service' })
  async createService(
    @Body() serviceData: CreateTherapistServiceDto,
    @Req() req: Request,
  ): Promise<TherapistServiceEntity> {

    const userId: string = req?.user?.id;
    const therapist: TherapistEntity = await this.therapistService.findOne({id: userId})

    if(!therapist)
      throw new ErrorHttpException(HttpStatus.BAD_REQUEST,'Therapist not found','User not found',null)



    return this.therapistServicesService.createService({...serviceData,therapist});
  }


  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.therapist)
  @ApiOperation({ summary: 'Find paginated therapist services' })
  async findPaginatedServices(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: Request,
  ): Promise<PaginatedResult<TherapistServiceEntity>> {

    const userId: string = req?.user?.id;
    const therapist: TherapistEntity = await this.therapistService.findOne({id: userId})

    if(!therapist)
      throw new ErrorHttpException(HttpStatus.BAD_REQUEST,'Therapist not found','User not found',null)

    return this.therapistServicesService.findPaginatedServicesByTherapist(therapist.id,page, limit);
  }


  @Get('/:therapistId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.client)
  @ApiOperation({ summary: 'Find paginated therapist services' })
  async findPaginatedServicesForClient(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('therapistId') therapistId: string,
  ): Promise<PaginatedResult<TherapistServiceEntity>> {

    
    const therapist: TherapistEntity = await this.therapistService.findOne({id: therapistId})

    if(!therapist)
      throw new ErrorHttpException(HttpStatus.BAD_REQUEST,'Therapist not found','User not found',null)

    return this.therapistServicesService.findPaginatedServicesByTherapist(therapist.id,page, limit);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.therapist)
  @Patch(':serviceId')
  @ApiOperation({ summary: 'Update a therapist service' })
  async updateService(
    @Param('serviceId') serviceId: string,
    @Body() updateData: UpdateTherapistServiceDto,
    @Req() req: Request,
  ): Promise<TherapistServiceEntity> {
    const therapistId: string = req?.user?.id;

    return this.therapistServicesService.updateService(
      serviceId,
      therapistId,
      updateData,
    );
  }



}
