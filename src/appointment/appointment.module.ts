import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from './entities/appointment.entity';
import { SessionRecordModule } from '../session-record/session-record.module';
import { ZoomModule } from '../zoom/zoom.module';
import { JwtAuthModule } from '../jwt/jwt.module';
import { ClientModule } from '../client/client.module';
import { UserModule } from '../user/user.module';
import { TherapistModule } from '../therapist/therapist.module';
import { TherapistServicesModule } from '../therapist-services/therapist-services.module';
import { TherapistAvailabilityModule } from '../therapist-availability/therapist-availability.module';

@Module({
  imports:[TherapistAvailabilityModule,TherapistServicesModule,TherapistModule,JwtAuthModule,ZoomModule,ClientModule,UserModule,TypeOrmModule.forFeature([AppointmentEntity]),SessionRecordModule,ZoomModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
