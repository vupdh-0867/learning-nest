import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [ConfigModule.forRoot(), PostsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
