import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { S3BucketService } from './s3-bucket.service';
import { CreateS3BucketDto } from './dto/create-s3-bucket.dto';
import { UpdateS3BucketDto } from './dto/update-s3-bucket.dto';

@Controller('s3-bucket')
export class S3BucketController {
  constructor(private readonly s3BucketService: S3BucketService) {}

  
}
