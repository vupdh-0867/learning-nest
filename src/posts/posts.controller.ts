import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, SerializeOptions, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { GROUP_POST, GROUP_ALL_POSTS } from "src/entities/post.entity";
import { UpdatePostDto } from "./dto/update-post.dto";
// TO-DO: Load user id when apply authentication
const USER_ID = '87bed0dc-2f00-4a05-ac4b-ac6333dac71f';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @SerializeOptions({groups: [GROUP_POST]})
  create(@Body(ValidationPipe) createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto, USER_ID)
  }

  @Get()
  @SerializeOptions({groups: [GROUP_ALL_POSTS]})
  findAll() {
    return this.postsService.findAll()
  }

  @Get(':id')
  @SerializeOptions({groups: [GROUP_POST]})
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Delete(':id')
  @SerializeOptions({groups: [GROUP_POST]})
  remove(@Param('id') id: string) {
    return this.postsService.remove(USER_ID, id);
  }

  @Patch(':id')
  @SerializeOptions({groups: [GROUP_POST]})
  update(@Body(ValidationPipe) updatePostDto: UpdatePostDto, @Param('id') id: string) {
    return this.postsService.update(id, updatePostDto, USER_ID);
  }
}
