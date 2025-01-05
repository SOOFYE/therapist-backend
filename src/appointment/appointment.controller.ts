import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Req, Query, HttpStatus, ForbiddenException, HttpException } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AppointmentEntity } from './entities/appointment.entity';
import { SessionRecordService } from '../session-record/session-record.service';
import { ZoomService } from '../zoom/zoom.service';
import { AppointmentTypeEnum } from './enum/appointment-type.enum';
import { RolesGuard } from '../common/guards/role.guard';
import { RoleEnum } from '../user/enums/role.enum';
import { Roles } from '../common/decorators/role.decorator';
import { Request } from 'express';
import { JwtAuthGuard } from '../jwt/guards/jwt-auth.guard';
import { ClientService } from '../client/client.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { ClientEntity } from '../client/entities/client.entity';
import { SessionRecordEntity } from '../session-record/entities/session-record.entity';
import { join } from 'path';
import { PaginatedResult } from '../common/interfaces/paginated-results.interface';
import { ErrorHttpException } from '../common/errors/error-http.exception';
import { RescheduleAppointmentDto } from './dto/reshedule-appointment.dto';
import { SuccessResponse } from '../common/sucesses/success-http.response';
import { TherapistService } from '../therapist/therapist.service';
import { TherapistServicesService } from '../therapist-services/therapist-services.service';

@ApiTags('Appointments')
@Controller('appointments')
@ApiBearerAuth()
export class AppointmentController {
  constructor(    
    private readonly appointmentService: AppointmentService,
    private readonly sessionRecordService: SessionRecordService,
    private readonly zoomService: ZoomService,
    private readonly userService: UserService,
    private readonly therapistService: TherapistService,
    private readonly therapistServicesService: TherapistServicesService
  
  ) {}


  @Get('/booked-times')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.client, RoleEnum.therapist)
  @ApiOperation({ summary: 'Get booked appointment times for a specific date and therapist' })
  @ApiQuery({ name: 'date', type: String, description: 'Date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'therapistId', type: String, description: 'Therapist ID (UUID)' })
  async getBookedAppointments(
    @Query('date') date: string,
    @Query('therapistId') therapistId: string,
  ): Promise<SuccessResponse<{ startTime: string; endTime: string; }[]>> {
    try {
      
      if (!date || !therapistId) {
        throw new ErrorHttpException(
          HttpStatus.BAD_REQUEST,
          'Date and Therapist ID are required',
          'Bad Request'
        );
      }

     let response = await this.appointmentService.getBookedAppointments(date, therapistId);
     return new SuccessResponse(HttpStatus.OK,`Bookings for date ${date} fetched successfully `,response)
       
    } catch (error) {
      if (!(error instanceof ErrorHttpException)) {
        throw new ErrorHttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong while fetching client appointments.',
          'Internal Server Error',
          null
        );
      }
      throw error;
    }
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.client, RoleEnum.therapist)
  @Get('/my')
  @ApiOperation({ summary: 'Get paginated appointments for the logged-in user (client,therapist)' })
  async getAppointments(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<SuccessResponse<PaginatedResult<AppointmentEntity>>> {
    try {
      const userId: string = req?.user?.id;
      const role: RoleEnum = req?.user?.role;
      const appointments = await this.appointmentService.getAppointmentsForUser(userId, role, page, limit);
  
      return new SuccessResponse(HttpStatus.OK, 'Appointments retrieved successfully.', appointments);
    } catch (error) {
      if (!(error instanceof ErrorHttpException)) {
        throw new ErrorHttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong while fetching appointments.',
          'Internal Server Error',
          null
        );
      }
      throw error;
    }
  }



  @UseGuards(JwtAuthGuard)
  @Get(':appointmentId')
  @ApiOperation({ summary: 'Get details of an appointment by ID' })
  async getAppointmentById(@Param('appointmentId') appointmentId: string): Promise<SuccessResponse<AppointmentEntity>> {
    try {
      const appointment = await this.appointmentService.getAppointmentById(appointmentId);
      if (!appointment) {
        throw new ErrorHttpException(
          HttpStatus.NOT_FOUND,
          'Appointment not found.',
          'Not Found',
          null
        );
      }
      return new SuccessResponse(HttpStatus.OK, 'Appointment details retrieved successfully.', appointment);
    } catch (error) {
      if (!(error instanceof ErrorHttpException)) {
        throw new ErrorHttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong while fetching appointment details.',
          'Internal Server Error',
          null
        );
      }
      throw error;
    }
  }


  


  


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.therapist)
  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get paginated appointments for a client' })
  async getAppointmentsForClient(
    @Req() req,
    @Param('clientId') clientId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<SuccessResponse<PaginatedResult<AppointmentEntity>>> {
    try {
      const user = await this.userService.findOne({ id: clientId });
      if (!user) {
        throw new ErrorHttpException(
          HttpStatus.NOT_FOUND,
          'Client not found.',
          'Not Found',
          null
        );
      }
      const appointments = await this.appointmentService.getAppointmentsForUser(user.id, user.role, page, limit);
      return new SuccessResponse(HttpStatus.OK, 'Appointments for client retrieved successfully.', appointments);
    } catch (error) {
      if (!(error instanceof ErrorHttpException)) {
        throw new ErrorHttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong while fetching client appointments.',
          'Internal Server Error',
          null
        );
      }
      throw error;
    }
  }


 



  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.client)
  @Post('/book/:therapistId')
  @ApiOperation({ summary: 'Create an appointment.' })
  async createAppointment(
    @Param('therapistId') therapistId: string,
    @Body() appointmentData: CreateAppointmentDto,
    @Req() req: Request
  ) {
    try {
      const userId: string = req?.user?.id;

      const client: UserEntity = await this.userService.findOne({ id: userId });
      if (!client) {
        throw new ErrorHttpException(HttpStatus.NOT_FOUND, 'Client not found.', 'Not Found', null);
      }
  
      const therapist = await this.therapistService.findOne({ id: therapistId });
      if (!therapist) {
        throw new ErrorHttpException(HttpStatus.NOT_FOUND, 'Therapist not found.', 'Not Found', null);
      }
  
      const service = await this.therapistServicesService.findOne({ id: appointmentData.serviceId, therapist: { id: therapistId } });
      if (!service) {
        throw new ErrorHttpException(HttpStatus.NOT_FOUND, 'Selected service not found.', 'Not Found', null);
      }
  
  
      const { date, startTime, endTime, type } = appointmentData;
      const isAvailable = await this.appointmentService.checkAvailability(therapistId, date, startTime, endTime);
  
      if (!isAvailable) {
        throw new ErrorHttpException(
          HttpStatus.BAD_REQUEST,
          'Therapist is not available on this date/time.',
          'Request cannot be processed.',
          null
        );
      }
  
      let joinUrl: string = null;
      let meetingId: string = null;
  
      if (type === AppointmentTypeEnum.ONLINE) {
        ({ joinUrl, meetingId } = await this.zoomService.createMeeting(
          `Therapy Session on ${date} at ${startTime}`,
          `${date}T${startTime}`,
          this.calculateDuration(startTime, endTime)
        ));
      }
  
      const sessionRecord = await this.sessionRecordService.createSessionRecord({
        zoomMeetingLink: joinUrl,
        meetingId: meetingId,
      });
  
      const appointment = await this.appointmentService.createAppointment(client.id, therapistId, {
        date,
        startTime,
        endTime,
        type,
        service
      });
  
      await this.sessionRecordService.updateSessionRecord(
        { id: sessionRecord.id },
        { appointment }
      );
  
      return new SuccessResponse(
        HttpStatus.CREATED,
        'Appointment created successfully.',
        { appointment, sessionRecord }
      );
    } catch (error) {
      if (!(error instanceof ErrorHttpException)) {
        throw new ErrorHttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong while creating the appointment.',
          'Internal Server Error',
          null
        );
      }
      throw error;
    }
  }



  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.therapist)
  @Patch('reschedule/:appointmentId')
  @ApiOperation({ summary: 'Reschedule an appointment.' })
  async rescheduleAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() rescheduleData: RescheduleAppointmentDto,
    @Req() req: Request
  ) {
    try {
      const userId: string = req?.user?.id;
      const { date, startTime, endTime, type } = rescheduleData;
  
      const appointment = await this.appointmentService.getAppointmentById(appointmentId);
  
      if (!appointment) {
        throw new ErrorHttpException(
          HttpStatus.NOT_FOUND,
          'Appointment not found.',
          'Not Found',
          null
        );
      }
  
      if (appointment.therapist.id !== userId) {
        throw new ErrorHttpException(
          HttpStatus.FORBIDDEN,
          'You are not authorized to reschedule this appointment.',
          'Forbidden',
          null
        );
      }
  
      const isAvailable = await this.appointmentService.checkAvailability(userId, date, startTime, endTime);
  
      if (!isAvailable) {
        throw new ErrorHttpException(
          HttpStatus.BAD_REQUEST,
          'Therapist is not available on this date/time.',
          'Request cannot be processed.',
          null
        );
      }
  
      if (appointment.type !== type) {
        if (type === AppointmentTypeEnum.ONLINE) {
          const { joinUrl, meetingId } = await this.zoomService.createMeeting(
            `Therapy Session on ${date} at ${startTime}`,
            `${date}T${startTime}`,
            this.calculateDuration(startTime, endTime)
          );
  
          await this.sessionRecordService.updateSessionRecord(
            { id: appointment.sessionRecord.id },
            { zoomMeetingLink: joinUrl, meetingId }
          );
        } else if (type === AppointmentTypeEnum.IN_PERSON) {
          if (appointment.sessionRecord?.meetingId) {
            await this.zoomService.deleteMeeting(appointment.sessionRecord.meetingId);
          }
  
          await this.sessionRecordService.updateSessionRecord(
            { id: appointment.sessionRecord.id },
            { zoomMeetingLink: null, meetingId: null }
          );
        }
      }
  
      const updatedAppointment = await this.appointmentService.updateAppointment(appointmentId, {
        date,
        startTime,
        endTime,
        type,
      });
  
      return new SuccessResponse(
        HttpStatus.OK,
        'Appointment rescheduled successfully.',
        updatedAppointment
      );
    } catch (error) {
      if (!(error instanceof ErrorHttpException)) {
        throw new ErrorHttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong while rescheduling the appointment.',
          'Internal Server Error',
          null
        );
      }
      throw error;
    }
  }
  


  
  
    private calculateDuration(startTime: string, endTime: string): number {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
  
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
  
      return (endTotalMinutes - startTotalMinutes) / 60; 
    }
}

