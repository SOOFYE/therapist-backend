import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { TherapistAvailabilityEntity } from '../therapist-availability/entities/therapist-availability.entity';
import { AppointmentEntity } from './entities/appointment.entity';
import { DayOfWeekEnum } from '../therapist-availability/enum/days-of-week.enum';
import { AppointmentTypeEnum } from './enum/appointment-type.enum';

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
    appointmentData: { date: string; startTime: string; endTime: string; type: AppointmentTypeEnum },
  ): Promise<AppointmentEntity> {
    const { date, startTime, endTime, type } = appointmentData;

    

  
    const appointment = this.appointmentRepository.create({
      date,
      startTime,
      endTime,
      type,
      therapist: { id: therapistId },
      client: { id: clientId },
    });

    console.log(appointment)

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
          startTime: LessThan(endTime), // Existing start time is before the new end time
          endTime: MoreThan(startTime), // Existing end time is after the new start time
        },
      ],
    });


    console.log(overlappingAppointments)
  
    
    return !overlappingAppointments;
  }

  private getDayOfWeek(date: string): DayOfWeekEnum {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[new Date(date).getDay()];
    return DayOfWeekEnum[dayName as keyof typeof DayOfWeekEnum];
  }
}
