import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { UserEntity } from '../../user/entities/user.entity';
import { TherapistEntity } from '../../therapist/entities/therapist.entity';
import { TherapistAvailabilityEntity } from '../../therapist-availability/entities/therapist-availability.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TherapistEntity,TherapistAvailabilityEntity]), 
  ],
  providers: [SeedService],
  exports: [SeedService], 
})
export class SeedModule {}