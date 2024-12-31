import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from '../appointment/entities/appointment.entity';
import { PaginatedResult } from '../common/interfaces/paginated-results.interface';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientEntity } from './entities/client.entity';

@Injectable()
export class ClientService {

  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}


    async create(createClientDto:CreateClientDto): Promise<ClientEntity> {
      const newClient = this.clientRepository.create(createClientDto);
      return this.clientRepository.save(newClient);
    }


    async findOne(options: Partial<ClientEntity>): Promise<ClientEntity | null> {
      return this.clientRepository.findOne({ where: options });
    }


    async findOneWithRelation(options: Partial<ClientEntity>, relations: string[] = []): Promise<ClientEntity | null> {
      return this.clientRepository.findOne({
        where: options,
        relations,
      });
    }


  async getClientAppointments(
    clientId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<AppointmentEntity>> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be positive integers');
    }

    const [data, total] = await this.appointmentRepository.findAndCount({
      where: { client: { id: clientId } },
      relations: ['therapist'], 
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC', startTime: 'ASC' },
    });

    return {
      data,
      total,
      page,
      hasNext: page * limit < total,
    };
  }
  
}
