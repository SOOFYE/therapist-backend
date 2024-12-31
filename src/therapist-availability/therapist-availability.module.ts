import { Module } from '@nestjs/common';
import { TherapistAvailabilityService } from './therapist-availability.service';
import { TherapistAvailabilityController } from './therapist-availability.controller';
import { TherapistAvailabilityEntity } from './entities/therapist-availability.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([TherapistAvailabilityEntity])],
  controllers: [TherapistAvailabilityController],
  providers: [TherapistAvailabilityService],
})
export class TherapistAvailabilityModule {}
