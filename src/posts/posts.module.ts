import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostRepository } from './post.repository';
import { Post } from '../entities/post.entity';
import { UploadFileModule } from '../multer/upload-file.module';
import { SendMailModule } from 'src/mailer/send-mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UploadFileModule, SendMailModule],
  providers: [PostsService, PostRepository],
  controllers: [PostsController],
})
export class PostsModule {}
