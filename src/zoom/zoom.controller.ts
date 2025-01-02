import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { ZoomService } from './zoom.service';

import { SessionRecordService } from '../session-record/session-record.service';
import * as crypto from 'crypto';
import { createClient } from '@deepgram/sdk';

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


  // @Post('create-meeting')
  // @ApiOperation({ summary: 'Create a Zoom meeting link' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Meeting link created successfully',
  //   schema: {
  //     example: {
  //       join_url: 'https://zoom.us/j/123456789',
  //     },
  //   },
  // })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // async createMeeting(
  //   @Body() createZoomMeetingDto: CreateZoomMeetingDto,
  // ): Promise<{joinUrl: string,meetingId:string}> {
  //   const { topic, startTime, duration } = createZoomMeetingDto;


  //    let {joinUrl,  meetingId} = await this.zoomService.createMeeting(topic, startTime, duration);
  //   return {joinUrl,  meetingId};
  // }


  // @Patch('update-meeting/:meetingId')
  // @ApiOperation({ summary: 'Update an existing Zoom meeting' })
  // async updateMeeting(
  //   @Param('meetingId') meetingId: string,
  //   @Body() updatedData: UpdateZoomMeetingDto ,
  // ): Promise<any> {
  //   return this.zoomService.updateMeeting(meetingId, updatedData);
  // }


  // @Get('meeting-details/:meetingId')
  // @ApiOperation({ summary: 'Get details of a Zoom meeting by its ID' })
  // @ApiParam({
  //   name: 'meetingId',
  //   description: 'The ID of the Zoom meeting to fetch',
  //   example: '123456789',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Meeting details retrieved successfully',
  //   schema: {
  //     example: {
  //       id: '123456789',
  //       topic: 'Therapy Session',
  //       start_time: '2024-12-20T15:00:00Z',
  //       duration: 60,
  //       join_url: 'https://zoom.us/j/123456789',
  //       host_email: 'therapist@example.com',
  //       participants: [],
  //     },
  //   },
  // })
  // @ApiResponse({ status: 404, description: 'Meeting not found' })
  // @ApiResponse({ status: 500, description: 'Failed to fetch meeting details' })
  // async getMeetingDetails(@Param('meetingId') meetingId: string): Promise<any> {
  //   return this.zoomService.getMeetingDetails(meetingId);
  // }


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
        const mp4File = payload.recording_files.find(
          (file) => file.file_type === 'MP4' && file.file_extension === 'MP4',
        );
  
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
  
        // Step 2: Upload MP4 to S3
        const s3Url = await this.s3Service.uploadFile(recordingPath, safeFileName, 'recordings');


        console.log(s3Url)


        let presignedUrl = await this.s3Service.generatePresignedUrl(s3Url)


        console.log(presignedUrl)
  
        // Step 3: Transcribe the video using Deepgram
        const {transcript, summary} = await this.transcribeWithDeepgram(presignedUrl);


      
  
  
        // Step 4: Save in the database
        await this.sessionRecordService.updateSessionRecord(
          { meetingId: payload.id },
          {
            sessionAudioUrl: s3Url,
            transcription: transcript,
            meetingSummary: summary,
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
  
  private async downloadRecording(url: string, token: string, fileName: string): Promise<string> {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'stream',
    });
  
  // Ensure the tmp directory exists
  const tmpDir = path.join(__dirname, '../../tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  const recordingPath = path.join(tmpDir, fileName);

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(recordingPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(recordingPath));
      writer.on('error', (error) => {
        console.error(`Error writing file to ${recordingPath}:`, error);
        reject(error);
      });
    });
  } catch (error) {
    console.error(`Error downloading recording from ${url}:`, error);
    throw new Error('Failed to download recording.');
  }
}



private async transcribeWithDeepgram(presignedUrl: string): Promise<{ transcript: string; summary: string }> {
  try {
    // Validate Deepgram API key
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
    if (!deepgramApiKey) {
      throw new Error('Deepgram API key is missing.');
    }

    // Initialize Deepgram client
    const deepgram = createClient(deepgramApiKey);

    // Step 1: Transcribe using the pre-signed URL
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      { url: presignedUrl },
      {
        model: 'nova-2',
        language: 'en',
        summarize: 'v2',
        smart_format: true,
        diarize: true,
      },
    );


    console.log(result,error)

    // Step 2: Extract transcription and summary
    const transcript = result?.results?.channels[0]?.alternatives[0]?.paragraphs?.transcript || '';
    const summary = result?.results?.summary?.short || '';

    if (!transcript || !summary) {
      throw new Error('Transcription or summary not available in Deepgram response.');
    }

    return { transcript, summary };
  } catch (error) {
    console.error('Error during Deepgram transcription:', error);
    throw new Error(`Failed to transcribe audio with Deepgram: ${error.message}`);
  }
}
  
  
}


