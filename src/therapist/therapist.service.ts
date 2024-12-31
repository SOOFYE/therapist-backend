import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TherapistEntity } from './entities/therapist.entity';

@Injectable()
export class TherapistService {

  constructor(
    @InjectRepository(TherapistEntity)
    private readonly therapistRepository: Repository<TherapistEntity>
  ){}


  async updateTherapist(id: string, updateData: Partial<TherapistEntity>): Promise<TherapistEntity> {
    const therapist = await this.therapistRepository.findOne({ where: { id } });
    if (!therapist) {
      throw new Error('Therapist not found');
    }
    Object.assign(therapist, updateData);
    return this.therapistRepository.save(therapist);
  }


}
