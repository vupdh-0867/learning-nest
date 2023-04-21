import { Injectable, BadRequestException } from '@nestjs/common';

import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { FileService } from '../multer/file.service';
import { UserDto } from '../user/dtos/user.dto';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly fileService: FileService,
    private readonly queueService: QueueService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: UserDto,
    file: Express.Multer.File,
  ): Promise<Post> {
    if (await this.postRepository.findOneBy({ title: createPostDto.title })) {
      throw new BadRequestException(['Title has been taken!']);
    }

    const post = await this.postRepository.createPostAndTags(
      createPostDto,
      user.id,
      file,
    );
    this.queueService.sendMailCreatePost(user, post);

    return this.attachPresignedUrl(post);
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<Post> {
    const post = await this.postRepository.createPostAndTags(
      {
        ...updatePostDto,
        id,
      },
      userId,
      file,
    );

    return this.attachPresignedUrl(post);
  }

  async findAll(): Promise<Post[]> {
    const posts: Post[] = await this.postRepository.find();
    const promisePresignedUrls = [];
    posts.forEach(({ fileName }) => {
      promisePresignedUrls.push(
        this.fileService.generatePresignedUrl(fileName),
      );
    });
    const presignedUrls: string[] = await Promise.all(promisePresignedUrls);

    return posts.map((post, index) => ({
      ...post,
      fileName: presignedUrls[index],
    }));
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOneByOrFail({ id });
    if (!post) {
      throw new BadRequestException([`This ${Post.name} does not exist!`]);
    }

    return this.attachPresignedUrl(post);
  }

  async remove(userId: string, id: string): Promise<Post> {
    const post = await this.postRepository.findOneByOrFail({
      userId: userId,
      id: id,
    });
    this.postRepository.softDelete(post.id);

    return post;
  }

  private async attachPresignedUrl(post: Post): Promise<Post> {
    return {
      ...post,
      fileName: await this.fileService.generatePresignedUrl(post.fileName),
    };
  }
}
