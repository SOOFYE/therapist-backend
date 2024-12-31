import { PartialType } from '@nestjs/swagger';
import { CreateS3BucketDto } from './create-s3-bucket.dto';

export class UpdateS3BucketDto extends PartialType(CreateS3BucketDto) {}
