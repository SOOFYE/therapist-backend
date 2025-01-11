import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentEntity } from '../appointment/entities/appointment.entity';
import { SessionRecordEntity } from './entities/session-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateSessionRecordDto } from './dto/create-session-record.dto';


@Injectable()
export class SessionRecordService {

  constructor(
    @InjectRepository(SessionRecordEntity)
    private readonly sessionRecordRepository: Repository<SessionRecordEntity>,
  ) {}



    async createSessionRecord(data: CreateSessionRecordDto ): Promise<SessionRecordEntity> {
      const sessionRecord = this.sessionRecordRepository.create(data);
      return this.sessionRecordRepository.save(sessionRecord);
    }

    async updateSessionRecord(
      where: FindOptionsWhere<SessionRecordEntity>,
      updateData: Partial<SessionRecordEntity>,
    ): Promise<SessionRecordEntity> {
      const sessionRecord = await this.sessionRecordRepository.findOne({
        where
      });
  
      if (!sessionRecord) {
        throw new NotFoundException('Session record not found');
      }
  
      Object.assign(sessionRecord, updateData);
      return this.sessionRecordRepository.save(sessionRecord);
    }
  

    async getSessionRecordById(sessionRecordId: string): Promise<SessionRecordEntity> {
      const sessionRecord = await this.sessionRecordRepository.findOne({
        where: { id: sessionRecordId },
      });
  
      if (!sessionRecord) {
        throw new NotFoundException('Session record not found');
      }
  
      return sessionRecord;
    }

    async deleteSessionRecord(sessionRecordId: string): Promise<void> {
      const result = await this.sessionRecordRepository.delete(sessionRecordId);
      if (result.affected === 0) {
        throw new NotFoundException('Session record not found');
      }
    }
  

    async getSessionRecordsByAppointment(
      appointmentId: string,
    ): Promise<SessionRecordEntity[]> {
      return this.sessionRecordRepository.find({
        where: { appointment: { id: appointmentId } },
        relations: ['appointment'],
      });
    }
  

    async getSessionRecordsByTherapist(
      therapistId: string,
    ): Promise<SessionRecordEntity[]> {
      return this.sessionRecordRepository.find({
        where: { appointment: { therapist: { id: therapistId } } },
        relations: ['appointment'],
      });
    }
  

    async getSessionRecordsByClient(clientId: string): Promise<SessionRecordEntity[]> {
      return this.sessionRecordRepository.find({
        where: { appointment: { client: { id: clientId } } },
        relations: ['appointment'],
      });
    }

    async findOne(where: FindOptionsWhere<SessionRecordEntity>): Promise<SessionRecordEntity | null> {
      return this.sessionRecordRepository.findOne({
        where,
        relations: ['appointment', 'appointment.therapist'], 
      });
    }

}
