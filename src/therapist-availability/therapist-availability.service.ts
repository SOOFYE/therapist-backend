import { Injectable } from '@nestjs/common';
import { CreateTherapistAvailabilityDto } from './dto/create-therapist-availability.dto';
import { UpdateTherapistAvailabilityDto } from './dto/update-therapist-availability.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TherapistAvailabilityEntity } from './entities/therapist-availability.entity';
import { DayOfWeekEnum } from './enum/days-of-week.enum';

@Injectable()
export class TherapistAvailabilityService {
  constructor(
    @InjectRepository(TherapistAvailabilityEntity)
    private readonly availabilityRepository: Repository<TherapistAvailabilityEntity>,
  ) {}


  async getTherapistAvailabilityForDay(
    therapistId: string,
    dayOfWeek: DayOfWeekEnum,
  ): Promise<TherapistAvailabilityEntity | null> {
    return this.availabilityRepository.findOne({
      where: { therapist: { id: therapistId }, dayOfWeek},
    });
  }


  async getTherapistAvailability(therapistId: string): Promise<TherapistAvailabilityEntity[]> {
    return this.availabilityRepository.find({
      where: { therapist: { id: therapistId } },
      order: { dayOfWeek: 'ASC' },
    });
  }

  async updateTherapistAvailability(
    therapistId: string,
    updates: {
      dayOfWeek: DayOfWeekEnum;
      startTime: string;
      endTime: string;
      isActive: boolean;
    }[],
  ): Promise<TherapistAvailabilityEntity[]> {
    const existingAvailability = await this.availabilityRepository.find({
      where: { therapist: { id: therapistId } },
    });

    // Update or create entries for each day
    const updatedAvailability = updates.map((update) => {
      const availability = existingAvailability.find(
        (a) => a.dayOfWeek === update.dayOfWeek,
      );

      if (availability) {
        availability.startTime = update.startTime;
        availability.endTime = update.endTime;
        availability.isActive = update.isActive;
        return availability;
      } else {
        return this.availabilityRepository.create({
          ...update,
          therapist: { id: therapistId },
        });
      }
    });

    return this.availabilityRepository.save(updatedAvailability);
  }
}
