import { Controller, Body, Param, Put, Patch, UseGuards, Req, Get, HttpException, HttpStatus } from '@nestjs/common';
import { TherapistService } from './therapist.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TherapistEntity } from './entities/therapist.entity';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/role.guard';
import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard';
import { RoleEnum } from '../user/enums/role.enum';
import { UpdateTherapistDto } from './dto/update-therapist.dto';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { ErrorHttpException } from '../common/errors/error-http.exception';
import { SuccessResponse } from '../common/sucesses/success-http.response';

@ApiTags('Therapist')
@Controller('therapist')
@ApiBearerAuth()
export class TherapistController {
  constructor(
    private readonly therapistService: TherapistService,
    private readonly userService: UserService

  ) {}


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.therapist)
  @Get('my')
  @ApiOperation({ summary: 'Get therapist and user details (Therapist only)' })
  async getTherapistDetails(
    @Req() req: Request
  ){
    try{
    const therapistId =  req.user.id;
    let response = await this.therapistService.findOneWithRelation({id: therapistId},['user'])
    if(!response) throw new ErrorHttpException(HttpStatus.NOT_FOUND,'Therapist not found','Not Found',null)
    return new SuccessResponse(HttpStatus.OK,'Therapist details found.',response)
    }catch(error){
      if (!(error instanceof ErrorHttpException)) {
        throw new ErrorHttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong while fetching therapist details.',
          'Internal Server Error',
          null
        );
      }
      throw error
    }
  }


  @Get('/:therapistId')
  @ApiOperation({ summary: 'Get therapist and user details (Therapist only)' })
  async getTherapistDetailsWithId(
    @Param('therapistId') therapistId: string,
    @Req() req: Request
  ){
    try{
    let response = await this.therapistService.findOneWithRelation({id: therapistId},['user'])
    if(!response) throw new ErrorHttpException(HttpStatus.NOT_FOUND,'Therapist not found','Not Found',null)
    return new SuccessResponse(HttpStatus.OK,'Therapist details found.',response)
    }catch(error){
      if (!(error instanceof ErrorHttpException)) {
        throw new ErrorHttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong while fetching therapist details.',
          'Internal Server Error',
          null
        );
      }
      throw error
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.therapist)
  @Put('')
  @ApiOperation({ summary: 'Update therapist and user details (Therapist only)' })
  async updateTherapist(
    @Body() dto: UpdateTherapistDto,
    @Req() req: Request
  ) {
    try {
      const id = req.user.id;
  
      // Update therapist details
      const therapist = await this.therapistService.updateTherapist(id, {
        country: dto?.country,
        preferredLanguages: dto?.preferredLanguages,
        preferredCurrency: dto?.preferredCurrency,
        timeZone: dto?.timeZone,
        officeLocation: dto?.officeLocation,
        workEmail: dto?.workEmail,
      });
  
      // Update user details
      const user = await this.userService.update(id, {
        firstName: dto?.firstName,
        middleName: dto?.middleName,
        lastName: dto?.lastName,
        email: dto?.email,
        phoneNumber: dto?.phoneNumber,
        dob: dto?.dob ? new Date(dto.dob) : undefined,
      });
  
      const response = user;
  
      return new SuccessResponse(
        HttpStatus.OK,
        'Therapist and user details updated successfully.',
        response
      );
    } catch (error) {
      if (!(error instanceof ErrorHttpException)) {
        throw new ErrorHttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong while updating therapist details.',
          'Internal Server Error',
          null
        );
      }
      throw error;
    }
  }
}
