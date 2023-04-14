import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3 } from 'aws-sdk';

import { FileService } from './file.service';

@Module({
  imports: [ConfigModule],
  providers: [FileService, S3],
  exports: [FileService],
})
export class UploadFileModule {}
