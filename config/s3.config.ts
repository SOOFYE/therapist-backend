import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  bucketName: process.env.S3_BUCKET_NAME,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
}));