import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostRepository } from './post.repository';
import { Post } from '../entities/post.entity';
import { UploadFileModule } from '../multer/upload-file.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UploadFileModule, QueueModule],
  providers: [PostsService, PostRepository],
  controllers: [PostsController],
})
export class PostsModule {}
