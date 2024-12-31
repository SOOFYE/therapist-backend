import { Module } from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { ZoomController } from './zoom.controller';
import { HttpModule } from '@nestjs/axios';
import { SessionRecordModule } from '../session-record/session-record.module';
import { S3BucketModule } from '../s3-bucket/s3-bucket.module';

@Module({
  imports: [HttpModule,SessionRecordModule,S3BucketModule],
  controllers: [ZoomController],
  providers: [ZoomService],
  exports: [ZoomService]
})
export class ZoomModule {}
