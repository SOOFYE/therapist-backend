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
import jwtConfig from '../config/jwt. config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        process.env.ENVIRONMENT === 'production'
          ? path.join(process.cwd(), '.env.production')
          : path.join(process.cwd(), '.env.local'),
      ],
      load: [databaseConfig, redisConfig, s3Config, jwtConfig],
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([ErrorLogEntity]),
    JwtAuthModule
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
