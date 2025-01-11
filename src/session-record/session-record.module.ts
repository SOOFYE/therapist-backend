import { Module } from '@nestjs/common';
import { SessionRecordService } from './session-record.service';
import { SessionRecordController } from './session-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionRecordEntity } from './entities/session-record.entity';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports: [JwtAuthModule,TypeOrmModule.forFeature([SessionRecordEntity])],
  controllers: [SessionRecordController],
  providers: [SessionRecordService],
  exports: [SessionRecordService]

})
export class SessionRecordModule {}
