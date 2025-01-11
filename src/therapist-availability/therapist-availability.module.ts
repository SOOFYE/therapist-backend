import { Module } from '@nestjs/common';
import { TherapistAvailabilityService } from './therapist-availability.service';
import { TherapistAvailabilityController } from './therapist-availability.controller';
import { TherapistAvailabilityEntity } from './entities/therapist-availability.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports:[JwtAuthModule,TypeOrmModule.forFeature([TherapistAvailabilityEntity])],
  controllers: [TherapistAvailabilityController],
  providers: [TherapistAvailabilityService],
  exports: [TherapistAvailabilityService],
})
export class TherapistAvailabilityModule {}
