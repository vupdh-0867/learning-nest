import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "../entities/post.entity";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostRepository } from "./post.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostsService, PostRepository],
  controllers: [PostsController],
})
export class PostsModule {}
