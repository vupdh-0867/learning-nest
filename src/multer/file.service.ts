import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class FileService {
  constructor(private readonly s3: S3) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.BUCKET_NAME,
        Body: file.buffer,
        Key: this.generateFileKey(file.originalname),
      })
      .promise();

    return uploadResult.Key;
  }

  async generatePresignedUrl(key: string): Promise<string> {
    if (!key) return '';

    return await this.s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    });
  }

  generateFileKey(filename: string): string {
    const randomToken = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    return `${randomToken}-${filename}`;
  }
}
