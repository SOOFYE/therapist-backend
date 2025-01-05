import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { TherapistAvailabilityEntity } from '../therapist-availability/entities/therapist-availability.entity';
import { AppointmentEntity } from './entities/appointment.entity';
import { DayOfWeekEnum } from '../therapist-availability/enum/days-of-week.enum';
import { AppointmentTypeEnum } from './enum/appointment-type.enum';
import { RoleEnum } from '../user/enums/role.enum';
import { PaginatedResult } from '../common/interfaces/paginated-results.interface';
import { TherapistServiceEntity } from '../therapist-services/entities/therapist-service.entity';

@Injectable()
export class AppointmentService {
  
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(TherapistAvailabilityEntity)
    private readonly availabilityRepository: Repository<TherapistAvailabilityEntity>,
  ) {}

  async createAppointment(
    clientId: string,
    therapistId: string,
    appointmentData: { date: string; startTime: string; endTime: string; type: AppointmentTypeEnum, service: TherapistServiceEntity },
    
  ): Promise<AppointmentEntity> {
    const { date, startTime, endTime, type } = appointmentData;

    
    const appointment = this.appointmentRepository.create({
      date,
      startTime,
      endTime,
      type,
      therapist: { id: therapistId },
      client: { id: clientId },
      service: appointmentData.service
    });

    console.log(appointment)

    return this.appointmentRepository.save(appointment);
  }


  async getAppointmentsForUser(
    userId: string,
    role: RoleEnum,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<AppointmentEntity>> {
    const skip = (page - 1) * limit;
  
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.sessionRecord', 'sessionRecord'); 
  
    if (role === RoleEnum.client) {
      queryBuilder.where('appointment.client = :userId', { userId });
    } else if (role === RoleEnum.therapist) {
      queryBuilder.where('appointment.therapist = :userId', { userId });
    } else {
      throw new Error('Invalid role provided');
    }
  
    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();
  
    return {
      hasNext: page * limit < total,
      page,
      total,
      data,
    };
  }


  async getAppointmentById(appointmentId: string): Promise<AppointmentEntity> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['sessionRecord'], 
    });
  
    if (!appointment) {
      throw new BadRequestException('Appointment not found.');
    }
  
    return appointment;
  }


  async updateAppointment(
    appointmentId: string,
    updateData: Partial<{
      date: string;
      startTime: string;
      endTime: string;
      type: AppointmentTypeEnum;
    }>,
  ): Promise<AppointmentEntity> {
    
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });
  
    if (!appointment) {
      throw new BadRequestException('Appointment not found.');
    }
  
    
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        (appointment as any)[key] = value;
      }
    }
  
    
    return this.appointmentRepository.save(appointment);
  }



  async checkAvailability(
    therapistId: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    const dayOfWeek = this.getDayOfWeek(date);
  
   
    const availability = await this.availabilityRepository.findOne({
      where: { therapist: { id: therapistId }, dayOfWeek, isActive: true },
    });
  
    if (!availability) return false; 
  

    console.log('Start Time:', startTime);
    console.log('End Time:', endTime);
    console.log('Date:', date);


    
    if (startTime < availability.startTime || endTime > availability.endTime) return false;
  
   
    const overlappingAppointments = await this.appointmentRepository.findOne({
      where: [
        {
          therapist: { id: therapistId },
          date,
          startTime: LessThan(endTime), 
          endTime: MoreThan(startTime), 
        },
      ],
    });


    console.log(overlappingAppointments)
  
    
    return !overlappingAppointments;
  }






  async getBookedAppointments(
    date: string,
    therapistId: string,
  ): Promise<{ startTime: string; endTime: string }[]> {
    
    const appointments = await this.appointmentRepository.find({
      where: { date, therapist: { id: therapistId } },
      select: ['startTime', 'endTime'],
      relations: ['therapist']
    });

    return appointments;
  }

  private getDayOfWeek(date: string): DayOfWeekEnum {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[new Date(date).getDay()];
    return DayOfWeekEnum[dayName as keyof typeof DayOfWeekEnum];
  }
}
