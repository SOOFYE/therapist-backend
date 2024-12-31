import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SessionRecordService } from './session-record.service';
import { CreateSessionRecordDto } from './dto/create-session-record.dto';
import { UpdateSessionRecordDto } from './dto/update-session-record.dto';

@Controller('session-record')
export class SessionRecordController {
  constructor(private readonly sessionRecordService: SessionRecordService) {}

  
}
