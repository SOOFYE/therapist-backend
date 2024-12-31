import { Module } from '@nestjs/common';
import { TherapistServicesService } from './therapist-services.service';
import { TherapistServicesController } from './therapist-services.controller';
import { TherapistServiceEntity } from './entities/therapist-service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports:[TypeOrmModule.forFeature([TherapistServiceEntity])],
  controllers: [TherapistServicesController],
  providers: [TherapistServicesService],
})
export class TherapistServicesModule {}
