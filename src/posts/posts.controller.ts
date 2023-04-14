import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BriefPostDto } from './dto/brief-post.dto';
import { DetailsPostDto } from './dto/details-post.dto';
import { Serializer } from '../decorators/serializer.decorator';
import { FileSizeValidationPipe } from '../shared/pipes/file-validation.pipe';
// TO-DO: Load user id when apply authentication
const USER_ID = '87bed0dc-2f00-4a05-ac4b-ac6333dac71f';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new FileSizeValidationPipe())
  @Serializer(DetailsPostDto)
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<BriefPostDto> {
    return this.postsService.create(createPostDto, USER_ID, file);
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
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new FileSizeValidationPipe())
  @Serializer(DetailsPostDto)
  update(
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile('file') file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<DetailsPostDto> {
    return this.postsService.update(id, updatePostDto, USER_ID, file);
  }
}
