import {  IsString } from 'class-validator';

export class CreateSessionRecordDto {

  @IsString()
  zoomMeetingLink: string;

  @IsString()
  meetingId: string;
}
