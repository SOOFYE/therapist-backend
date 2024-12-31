import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TherapistServiceEntity } from './entities/therapist-service.entity';
import { PaginatedResult } from '../common/interfaces/paginated-results.interface';

@Injectable()
export class TherapistServicesService {
  constructor(
    @InjectRepository(TherapistServiceEntity)
    private readonly serviceRepository: Repository<TherapistServiceEntity>,
  ) {}

  async createService(serviceData: Partial<TherapistServiceEntity>): Promise<TherapistServiceEntity> {
    const service = this.serviceRepository.create(serviceData);
    return this.serviceRepository.save(service);
  }

  async findOneService(id: string): Promise<TherapistServiceEntity> {
    return this.serviceRepository.findOne({ where: { id } });
  }

  async findManyServices(): Promise<TherapistServiceEntity[]> {
    return this.serviceRepository.find();
  }

  async findPaginatedServices(page: number, limit: number): Promise<PaginatedResult<TherapistServiceEntity>> {
    const [data, total] = await this.serviceRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      hasNext: total > page * limit,
      page,
      total,
      data,
    };
  }
}
