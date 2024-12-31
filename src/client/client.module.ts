import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from '../appointment/entities/appointment.entity';
import { ClientEntity } from './entities/client.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AppointmentEntity,ClientEntity])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
