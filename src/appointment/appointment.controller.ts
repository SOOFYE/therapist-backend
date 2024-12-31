import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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

@ApiTags('Appointments')
@Controller('appointments')
@ApiBearerAuth()
export class AppointmentController {
  constructor(    
    private readonly appointmentService: AppointmentService,
    private readonly sessionRecordService: SessionRecordService,
    private readonly zoomService: ZoomService,
    private readonly clientService: ClientService,
    private readonly userService: UserService
  
  ) {}





    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(RoleEnum.client)

    @Post(':therapistId')
    @ApiOperation({ summary: 'Create an appointment' })
    async createAppointment(
      @Param('therapistId') therapistId: string,
      @Body() appointmentData: CreateAppointmentDto,
      @Req() req: Request
    ): Promise<{appointment: AppointmentEntity,sessionRecord: SessionRecordEntity}> {
      const { date, startTime, endTime, type } = appointmentData;


      try{

      const userId: string = req?.user?.id;

      const clients: ClientEntity = await this.clientService.findOneWithRelation(
        { user: { id: userId } as UserEntity }, 
        ['user'] 
      );

      const isAvailable = await this.appointmentService.checkAvailability(
        therapistId,
        date,
        startTime,
        endTime,
      );
      if (!isAvailable) {
        throw new BadRequestException('Therapist is not available or time overlaps.');
      }
  
    
      
      let joinUrl:string = null;
      let meetingId:string = null;
      if (type === AppointmentTypeEnum.ONLINE) {
        ({ joinUrl, meetingId } = await this.zoomService.createMeeting(
          'Therapy Session',
          `${date}T${startTime}`,
          this.calculateDuration(startTime, endTime),
        ));
      }
  
      
      const sessionRecord = await this.sessionRecordService.createSessionRecord({
        zoomMeetingLink:joinUrl,
        meetingId: meetingId,
      });


      const appointment = await this.appointmentService.createAppointment(
        clients.id,
        therapistId,
        { date, startTime, endTime, type },
      );
  
      await this.sessionRecordService.updateSessionRecord({id: sessionRecord.id}, {
        appointment,
      });
  
      return {appointment,sessionRecord};
    }catch(error){
      throw error
      console.log(error)
    }
    }
  
    private calculateDuration(startTime: string, endTime: string): number {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
  
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
  
      return (endTotalMinutes - startTotalMinutes) / 60; // Duration in hours
    }
}

