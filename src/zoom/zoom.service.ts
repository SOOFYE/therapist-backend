import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ZoomService {

    private  zoomApiUrl;
    private accessToken: string | null = null;
    private readonly zoomAccountId;
    private readonly zoomClientId;
    private readonly zoomClientSecret; 
   

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService 
    ) {
        this.zoomApiUrl = this.configService.get<string>('zoom.zoomApiUrl');
        this.zoomAccountId = this.configService.get<string>('zoom.zoomAccountId');
        this.zoomClientId = this.configService.get<string>('zoom.zoomClientId');
        this.zoomClientSecret = this.configService.get<string>('zoom.zoomClientSecret');
    }

    private async getAccessToken(): Promise<string> {
        if (this.accessToken) {
          return this.accessToken; 
        }
    
        const url = `https://zoom.us/oauth/token`;
        const payload = `grant_type=account_credentials&account_id=${this.zoomAccountId}`;
        const encodedCredentials = Buffer.from(
          `${this.zoomClientId}:${this.zoomClientSecret}`,
        ).toString('base64');
    
        try {
          const response = await firstValueFrom(
            this.httpService.post(url, payload, {
              headers: {
                Authorization: `Basic ${encodedCredentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }),
          );
    
          this.accessToken = response.data.access_token;
          setTimeout(() => (this.accessToken = null), response.data.expires_in * 1000);
          return this.accessToken;
        } catch (error) {
            console.log(error)
          throw new HttpException(
            'Failed to retrieve Zoom access token',
            error.response?.status || 500,
          );
        }
      }
    

      async createMeeting(topic: string, startTime: string, duration: number): Promise<{joinUrl: string,meetingId:string}> {
        const token = await this.getAccessToken();
    
        const payload = {
          topic,
          type: 2, 
          start_time: startTime, 
          duration,
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            auto_recording: 'cloud',
            approval_type: 0, 
          },
        };
    
        try {
          const response = await firstValueFrom(
            this.httpService.post(`${this.zoomApiUrl}/users/me/meetings`, payload, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }),
          );
    
          const { join_url, id  } = response.data;

          return {
            joinUrl: join_url,
            meetingId: id,
          };
        } catch (error) {
            console.log(error)
          throw new HttpException(
            'Failed to create Zoom meeting',
            error.response?.status || 500,
          );
        }
      }


      async updateMeeting(meetingId: string, updatedData: { topic?: string; startTime?: string; duration?: number }): Promise<any> {
        const token = await this.getAccessToken();
    
        const payload: any = {};
        if (updatedData.topic) payload.topic = updatedData.topic;
        if (updatedData.startTime) payload.start_time = updatedData.startTime; 
        if (updatedData.duration) payload.duration = updatedData.duration;
    
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
    
        try {
          const response = await firstValueFrom(
            this.httpService.patch(`${this.zoomApiUrl}/meetings/${meetingId}`, payload, { headers }),
          );
          return response.data; 
        } catch (error) {
          throw new HttpException(
            `Failed to update Zoom meeting: ${error.response?.data?.message || error.message}`,
            error.response?.status || 500,
          );
        }
      }



      async getMeetingDetails(meetingId: string): Promise<any> {

        const token = await this.getAccessToken();

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
    
        try {
          const response = await firstValueFrom(
            this.httpService.get(`${this.zoomApiUrl}/meetings/${meetingId}`, { headers }),
          );
          return response.data; 
        } catch (error) {
          throw new HttpException(
            `Failed to fetch Zoom meeting details: ${error.response?.data?.message || error.message}`,
            error.response?.status || 500,
          );
        }
      }


      async deleteMeeting(
        meetingId: string,
        cancelReminders: boolean = false,
        notifyHosts: boolean = false,
      ): Promise<void> {
        const token = await this.getAccessToken();
    
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
    
        const queryParams = new URLSearchParams();
        if (cancelReminders) queryParams.append('cancel_meeting_reminder', 'true');
        if (notifyHosts) queryParams.append('schedule_for_reminder', 'true');
    
        const url = `${this.zoomApiUrl}/meetings/${meetingId}?${queryParams.toString()}`;
    
        try {
          await firstValueFrom(
            this.httpService.delete(url, { headers }),
          );
          console.log(`Meeting with ID ${meetingId} deleted successfully.`);
        } catch (error) {
          console.error('Error deleting Zoom meeting:', error.response?.data || error.message);
          throw new HttpException(
            `Failed to delete Zoom meeting: ${error.response?.data?.message || error.message}`,
            error.response?.status || 500,
          );
        }
      }

      async getMeetingRecordingUrl(meetingId: string): Promise<string> {
        const token = await this.getAccessToken();
    
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    
        try {
            
            const response = await firstValueFrom(
                this.httpService.get(`${this.zoomApiUrl}/meetings/${meetingId}/recordings`, { headers }),
            );
    
            const recordingFiles = response.data.recording_files;
    
            if (!recordingFiles || recordingFiles.length === 0) {
                throw new HttpException('No recordings found for the specified meeting', 404);
            }
    
            
            const preferredFile = recordingFiles.find((file) => file.file_type === 'MP4' ) ||
                                  recordingFiles.find((file) => file.file_type === 'TRANSCRIPT');
    
            if (!preferredFile) {
                throw new HttpException('No valid recording files (TRANSCRIPT/MP4) found', 404);
            }
    
            
            return preferredFile.download_url;
        } catch (error) {
            console.log(error);
            throw new HttpException(
                `Failed to fetch meeting recordings: ${error.response?.data?.message || error.message}`,
                error.response?.status || 500,
            );
        }
    }

    }