import { PartialType } from '@nestjs/swagger';
import { CreateSessionRecordDto } from './create-session-record.dto';

export class UpdateSessionRecordDto extends PartialType(CreateSessionRecordDto) {}
