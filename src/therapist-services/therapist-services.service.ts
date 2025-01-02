import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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

  async findOne( where: FindOptionsWhere<TherapistServiceEntity>,): Promise<TherapistServiceEntity> {
    return this.serviceRepository.findOne({ where });
  }

  async findManyServices(): Promise<TherapistServiceEntity[]> {
    return this.serviceRepository.find();
  }

  async findPaginatedServicesByTherapist(
    therapistId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<TherapistServiceEntity>> {
    const [data, total] = await this.serviceRepository.findAndCount({
      where: { therapist: { id: therapistId } },
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


  async updateService(
    serviceId: string,
    therapistId: string,
    updateData: Partial<TherapistServiceEntity>,
  ): Promise<TherapistServiceEntity> {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId, therapist: { id: therapistId } },
    });

    if (!service) {
      throw new NotFoundException('Service not found or does not belong to this therapist');
    }

    Object.assign(service, updateData);
    return this.serviceRepository.save(service);
  }



}
