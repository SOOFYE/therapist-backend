import * as path from 'path';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import redisConfig from '../config/redis.config';
import s3Config from '../config/s3.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CustomHttpExceptionFilter } from './common/filters/http-exception.filter';

import { AppDataSource } from './database/data-source';
import { ErrorLogEntity } from './common/entities/error-log.entity';
import { JwtAuthModule } from './jwt/jwt.module';
import { UserModule } from './user/user.module';
import { TherapistModule } from './therapist/therapist.module';
import { TherapistServicesModule } from './therapist-services/therapist-services.module';
import { TherapistAvailabilityModule } from './therapist-availability/therapist-availability.module';
import { ClientModule } from './client/client.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ZoomModule } from './zoom/zoom.module';
import { SessionRecordModule } from './session-record/session-record.module';
import jwtConfig from '../config/jwt. config';
import emailConfig from '../config/email.config';
import zoomConfig from '../config/zoom.config';
import { SeedModule } from './database/seeds/seed.module';
import { S3BucketModule } from './s3-bucket/s3-bucket.module';
import therapistConfig from '../config/therapist.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        process.env.ENVIRONMENT === 'production'
          ? path.join(process.cwd(), '.env.production')
          : path.join(process.cwd(), '.env.local'),
      ],
      load: [databaseConfig, redisConfig, s3Config, jwtConfig, emailConfig, zoomConfig,therapistConfig],
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([ErrorLogEntity]),
    JwtAuthModule,
    UserModule,
    TherapistModule,
    TherapistServicesModule,
    TherapistAvailabilityModule,
    ClientModule,
    AuthModule,
    EmailModule,
    AppointmentModule,
    ZoomModule,
    SessionRecordModule,
    SeedModule,
    S3BucketModule
  ],
  controllers: [AppController],
  providers: [
  
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomHttpExceptionFilter,
    },
    {
      provide: DataSource,
      useFactory: async () => {
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }
        return AppDataSource;
      },
    },
  ],
  exports: [DataSource],
})
export class AppModule {}
