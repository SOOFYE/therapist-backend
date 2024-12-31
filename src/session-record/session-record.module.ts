import { Module } from '@nestjs/common';
import { SessionRecordService } from './session-record.service';
import { SessionRecordController } from './session-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionRecordEntity } from './entities/session-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionRecordEntity])],
  controllers: [SessionRecordController],
  providers: [SessionRecordService],
  exports: [SessionRecordService]

})
export class SessionRecordModule {}
