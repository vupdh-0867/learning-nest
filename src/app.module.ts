import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { queueConfig } from './queue/queue.config';
import { mailerConfig } from './mailer/mailer.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot(queueConfig),
    MailerModule.forRoot(mailerConfig),
    PostsModule,
    DatabaseModule,
    AuthModule,
    EventEmitterModule.forRoot(),
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
