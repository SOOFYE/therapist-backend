import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as url from 'url';

@Injectable()
export class S3BucketService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('s3.accessKey'),
      secretAccessKey: this.configService.get<string>('s3.secretKey'),
      region: this.configService.get<string>('s3.region'),
    });
    this.bucketName = this.configService.get<string>('s3.bucketName');
  }

  async uploadFile(filePath: string, fileName: string, savePath: string): Promise<string> {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: this.bucketName,
      Key: `${savePath}/${fileName}`, 
      Body: fileContent,
    };

    const result = await this.s3.upload(params).promise();
    return result.Location; 
  }

  async generatePresignedUrl(s3Url: string): Promise<string> {
    try {
      
      const parsedUrl = url.parse(s3Url);
      const bucket = this.bucketName; 
      const key = decodeURIComponent(parsedUrl.pathname?.slice(1) || '');
  
      if (!key) {
        throw new Error('Invalid S3 URL: Key could not be extracted.');
      }
  
      const params = {
        Bucket: bucket,
        Key: key,
        Expires: 3600, 
      };
  
      return this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('Error generating pre-signed URL:', error.message);
      throw new Error('Failed to generate pre-signed URL.');
    }
  }
}