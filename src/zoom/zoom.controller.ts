import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateZoomMeetingDto } from './dto/create-meet.dto';
import { UpdateZoomMeetingDto } from './dto/update-meet.dto';
import { SessionRecordService } from '../session-record/session-record.service';
import * as crypto from 'crypto';
import * as vttToJson from 'vtt-to-json';

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { Request, Response } from 'express';
import { S3BucketService } from '../s3-bucket/s3-bucket.service';

@Controller('webhook/zoom')
export class ZoomController {
  constructor(
    private readonly zoomService: ZoomService,
    private readonly s3Service: S3BucketService,
    private readonly sessionRecordService: SessionRecordService
  ) {}


  @Post('create-meeting')
  @ApiOperation({ summary: 'Create a Zoom meeting link' })
  @ApiResponse({
    status: 201,
    description: 'Meeting link created successfully',
    schema: {
      example: {
        join_url: 'https://zoom.us/j/123456789',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createMeeting(
    @Body() createZoomMeetingDto: CreateZoomMeetingDto,
  ): Promise<{joinUrl: string,meetingId:string}> {
    const { topic, startTime, duration } = createZoomMeetingDto;


     let {joinUrl,  meetingId} = await this.zoomService.createMeeting(topic, startTime, duration);
    return {joinUrl,  meetingId};
  }


  @Patch('update-meeting/:meetingId')
  @ApiOperation({ summary: 'Update an existing Zoom meeting' })
  async updateMeeting(
    @Param('meetingId') meetingId: string,
    @Body() updatedData: UpdateZoomMeetingDto ,
  ): Promise<any> {
    return this.zoomService.updateMeeting(meetingId, updatedData);
  }


  @Get('meeting-details/:meetingId')
  @ApiOperation({ summary: 'Get details of a Zoom meeting by its ID' })
  @ApiParam({
    name: 'meetingId',
    description: 'The ID of the Zoom meeting to fetch',
    example: '123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting details retrieved successfully',
    schema: {
      example: {
        id: '123456789',
        topic: 'Therapy Session',
        start_time: '2024-12-20T15:00:00Z',
        duration: 60,
        join_url: 'https://zoom.us/j/123456789',
        host_email: 'therapist@example.com',
        participants: [],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Meeting not found' })
  @ApiResponse({ status: 500, description: 'Failed to fetch meeting details' })
  async getMeetingDetails(@Param('meetingId') meetingId: string): Promise<any> {
    return this.zoomService.getMeetingDetails(meetingId);
  }


  @Post('recording-completed')
  async handleRecordingCompleted(@Body() body: any, @Req() request: Request, @Res() response: Response) {
    const event = body.event;
  
    // Validate Zoom Endpoint URL
    if (event === 'endpoint.url_validation') {
      const hashForValidate = crypto
        .createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN)
        .update(body.payload.plainToken)
        .digest('hex');
  
      return response.status(200).json({
        plainToken: body.payload.plainToken,
        encryptedToken: hashForValidate,
      });
    }
  
    // Handle Recording Completed Event
    if (event === 'recording.completed') {
      try {
        const payload = body.payload.object;
        const downloadToken = body.download_token;
  
        // Focus on the MP4 file type
        const mp4File = payload.recording_files.find((file) => file.file_type === 'shared_screen_with_speaker_view' && file.file_extension === 'MP4');
  
        if (!mp4File) {
          console.error('MP4 file not found in recording files');
          return response.status(400).json({ message: 'MP4 file not found in recording files' });
        }
  
        const { download_url, file_name, file_extension } = mp4File;
  
        if (!download_url) {
          console.error('Invalid MP4 file: Missing download_url');
          return response.status(400).json({ message: 'Invalid MP4 file: Missing download_url' });
        }
  
        const safeFileName = file_name || `video_${Date.now()}.${file_extension}`;
  
        // Step 1: Download the MP4 file
        const recordingPath = await this.downloadRecording(download_url, downloadToken, safeFileName);
  
        // Step 2: Upload to S3
        const s3Url = await this.s3Service.uploadFile(recordingPath, safeFileName, 'recordings');
  
        // Step 3: Save MP4 information in session record
        await this.sessionRecordService.updateSessionRecord(
          { meetingId: payload.id },
          {
            sessionAudioUrl: s3Url, // Using the video file as the primary source
          },
        );
  
        // Cleanup downloaded file
        fs.unlinkSync(recordingPath);
  
        return response.status(200).json({ message: 'MP4 recording processed successfully.' });
      } catch (error) {
        console.error('Error processing Zoom webhook recording:', error);
        return response.status(500).json({ message: 'Failed to process Zoom webhook.', error: error.message });
      }
    }
  
    return response.status(200).json({ message: 'Event not processed.' });
  }
  
  @Post('recording-transcript-completed')
  async handleTranscriptCompleted(@Body() body: any, @Req() request: Request, @Res() response: Response) {
    const { event, payload, download_token } = body;
  
    // Validate Zoom Endpoint URL
    if (event === 'endpoint.url_validation') {
      const hashForValidate = crypto
        .createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN)
        .update(body.payload.plainToken)
        .digest('hex');
  
      return response.status(200).json({
        plainToken: body.payload.plainToken,
        encryptedToken: hashForValidate,
      });
    }
  
    if (event === 'recording.transcript_completed') {
      try {
        const transcriptionPayload = payload.object;
  
        // Find the transcription file (VTT format)
        const transcriptionFile = transcriptionPayload.recording_files.find(
          (file) => file.file_type === 'TRANSCRIPT' && file.file_extension === 'VTT',
        );
  
        if (!transcriptionFile) {
          console.error('Transcription file not found');
          return response.status(400).json({ message: 'Transcription file not found' });
        }
  
        const { download_url, file_name } = transcriptionFile;
  
        if (!download_url) {
          console.error('Invalid transcription file: Missing download_url');
          return response.status(400).json({ message: 'Invalid transcription file: Missing download_url' });
        }
  
        const safeFileName = file_name || `transcription_${Date.now()}.vtt`;
  
        // Step 1: Download the VTT file
        const vttFilePath = await this.downloadRecording(download_url, download_token, safeFileName);
  
        // Step 2: Convert VTT to JSON
        const transcriptionJson = await this.convertVTTtoJSON(vttFilePath);
  
        // Step 3: Upload JSON to S3
        const jsonFileName = `${path.basename(safeFileName, '.vtt')}.json`;
        const s3Url = await this.s3Service.uploadFile(transcriptionJson, jsonFileName, 'transcriptions');
  
        // Step 4: Update session record
        await this.sessionRecordService.updateSessionRecord(
          { meetingId: transcriptionPayload.id },
          {
            transcriptionUrl: s3Url,
          },
        );
  
        // Cleanup downloaded VTT file
        fs.unlinkSync(vttFilePath);
  
        return response.status(200).json({ message: 'Transcription processed successfully.' });
      } catch (error) {
        console.error('Error handling transcript webhook:', error);
        return response.status(500).json({ message: 'Failed to process transcript.', error: error.message });
      }
    }
  
    return response.status(200).json({ message: 'Event not processed.' });
  }

  private async downloadFile(url: string, token: string, fileName: string): Promise<string> {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'stream',
    });
  
    const filePath = path.join(__dirname, fileName);
    const writer = fs.createWriteStream(filePath);
  
    response.data.pipe(writer);
  
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  }
  
  private async downloadRecording(url: string, token: string, fileName: string): Promise<string> {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'stream',
    });
  
    const filePath = path.join(__dirname, fileName);
    const writer = fs.createWriteStream(filePath);
  
    response.data.pipe(writer);
  
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  }
  
  private async convertVTTtoJSON(vttFilePath: string): Promise<string> {
    const vttData = fs.readFileSync(vttFilePath, 'utf-8');
    const lines = vttData.split('\n');
    const jsonData = [];
  
    let timestamp = '';
    let text = '';
    for (const line of lines) {
      if (line.includes('-->')) {
        timestamp = line.trim();
      } else if (line.trim() === '') {
        if (timestamp && text) {
          jsonData.push({ timestamp, text: text.trim() });
          timestamp = '';
          text = '';
        }
      } else {
        text += `${line} `;
      }
    }
  
    const jsonFilePath = vttFilePath.replace('.vtt', '.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
    return jsonFilePath;
  }
}


