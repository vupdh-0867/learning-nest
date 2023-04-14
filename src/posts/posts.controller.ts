import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { UserDto } from '../user/dtos/user.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new FileSizeValidationPipe())
  @Serializer(DetailsPostDto)
  create(
    @CurrentUser() user: UserDto,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<BriefPostDto> {
    return this.postsService.create(createPostDto, user.id, file);
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
  remove(@CurrentUser() user: UserDto, @Param('id') id: string): Promise<BriefPostDto> {
    return this.postsService.remove(user.id, id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new FileSizeValidationPipe())
  @Serializer(DetailsPostDto)
  update(
    @CurrentUser() user: UserDto,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile('file') file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<DetailsPostDto> {
    return this.postsService.update(id, updatePostDto, user.id, file);
  }
}
