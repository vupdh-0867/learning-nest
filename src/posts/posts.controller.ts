import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BriefPostDto } from './dto/brief-post.dto';
import { DetailsPostDto } from './dto/details-post.dto';
import { Serializer } from '../decorators/serializer.decorator';
// TO-DO: Load user id when apply authentication
const USER_ID = '19640e8c-b0ba-46c2-92f5-03c80dc1dfc4';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Serializer(DetailsPostDto)
  create(@Body() createPostDto: CreatePostDto): Promise<BriefPostDto> {
    return this.postsService.create(createPostDto, USER_ID);
  }

  @Get()
  @Serializer(BriefPostDto)
  findAll(): Promise<BriefPostDto[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  @Serializer(DetailsPostDto)
  findOne(@Param('id') id: string): Promise<DetailsPostDto> {
    return this.postsService.findOne(id);
  }

  @Delete(':id')
  @Serializer(BriefPostDto)
  remove(@Param('id') id: string): Promise<BriefPostDto> {
    return this.postsService.remove(USER_ID, id);
  }

  @Patch(':id')
  @Serializer(DetailsPostDto)
  update(
    @Body() updatePostDto: UpdatePostDto,
    @Param('id') id: string,
  ): Promise<DetailsPostDto> {
    return this.postsService.update(id, updatePostDto, USER_ID);
  }
}
