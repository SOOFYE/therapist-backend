import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { TherapistEntity } from './entities/therapist.entity';

@Injectable()
export class TherapistService {

  constructor(
    @InjectRepository(TherapistEntity)
    private readonly therapistRepository: Repository<TherapistEntity>
  ) { }




  async findOne(where: FindOptionsWhere<TherapistEntity>): Promise<TherapistEntity | null> {
    const therapist = await this.therapistRepository.findOne({ where });
    return therapist;
  }


  async findOneWithRelation(
    where: FindOptionsWhere<TherapistEntity>,
    relations?: string[],): Promise<TherapistEntity | null> {
    const findOptions: FindOneOptions<TherapistEntity> = { where };

    if (relations && relations.length) {
      findOptions.relations = relations;
    }

    const therapist = await this.therapistRepository.findOne(findOptions);

    if (!therapist) return null

    return therapist;
  }


  async updateTherapist(id: string, updateData: Partial<TherapistEntity>): Promise<TherapistEntity | null> {
    const therapist = await this.therapistRepository.findOne({ where: { id } });
    if (!therapist) return null
    Object.assign(therapist, updateData);
    return this.therapistRepository.save(therapist);
  }


}
