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
import { TherapistAvailabilityService } from '../therapist-availability/therapist-availability.service';
import { GetAppointmentsFilterDto } from './dto/appointment-filter.dto';

@Injectable()
export class AppointmentService {
  
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    private readonly therapistAvailabilityService: TherapistAvailabilityService
    

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
    filters: GetAppointmentsFilterDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<AppointmentEntity>> {
    const skip = (page - 1) * limit;
  
    const {
      startDate,
      endDate,
      startTime,
      endTime,
      appointmentType,
      sortByDate = 'desc',
    } = filters;
  
    // Base filters for user role
    const where: Record<string, any> = {};
    if (role === RoleEnum.client) {
      where.client = { id: userId };
    } else if (role === RoleEnum.therapist) {
      where.therapist = { id: userId };
    } else {
      throw new Error('Invalid role provided');
    }
  
    // Apply dynamic filters
    if (startDate) {
      where.date = { $gte: startDate };
    }
    if (endDate) {
      where.date = { ...where.date, $lte: endDate };
    }
    if (startTime) {
      where.startTime = { $gte: startTime };
    }
    if (endTime) {
      where.endTime = { ...where.endTime, $lte: endTime };
    }
    if (appointmentType) {
      where.type = appointmentType;
    }
  
    // Fetch filtered and paginated results
    const [data, total] = await Promise.all([
      this.appointmentRepository.find({
        where,
        relations: ['therapist', 'service', 'client', 'sessionRecord'], // Include all necessary relations
        order: { date: sortByDate.toUpperCase() as 'ASC' | 'DESC' },
        skip,
        take: limit,
      }),
      this.appointmentRepository.count({ where }),
    ]);
  
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
    updateData: Partial<AppointmentEntity>,
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
  
   
    const availability =  await this.therapistAvailabilityService.getTherapistAvailabilityForDay(
      therapistId,
      dayOfWeek,
    );
  
    if (!availability || availability.isActive == false) return false; 
  

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
  ): Promise<{ 
    bookedTimes: { startTime: string; endTime: string }[];
    availability: TherapistAvailabilityEntity;
  }> {
  
    const dayOfWeek = this.getDayOfWeek(date);
  
   
    const availability = await this.therapistAvailabilityService.getTherapistAvailabilityForDay(
      therapistId,
      dayOfWeek,
    );
  
    
    const bookedTimes = await this.appointmentRepository.find({
      where: { date, therapist: { id: therapistId } },
      select: ['startTime', 'endTime'],
      relations: ['therapist'],
    });
  
    return { 
      bookedTimes, 
      availability 
    };
  }

  private getDayOfWeek(date: string): DayOfWeekEnum {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[new Date(date).getDay()];
    return DayOfWeekEnum[dayName as keyof typeof DayOfWeekEnum];
  }
}
