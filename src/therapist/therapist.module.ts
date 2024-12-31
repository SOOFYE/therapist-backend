import { Module } from '@nestjs/common';
import { TherapistService } from './therapist.service';
import { TherapistController } from './therapist.controller';
import { TherapistEntity } from './entities/therapist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports:[TypeOrmModule.forFeature([TherapistEntity])],
  controllers: [TherapistController],
  providers: [TherapistService],
})
export class TherapistModule {}
