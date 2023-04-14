import { Injectable } from '@nestjs/common';

import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    return this.postRepository.createPostAndTags(
      {
        ...createPostDto,
      },
      userId,
    );
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    return this.postRepository.createPostAndTags(
      {
        ...updatePostDto,
        id,
      },
      userId,
    );
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    return await this.postRepository.findOneByOrFail({ id });
  }

  async remove(userId: string, id: string): Promise<Post> {
    const post = await this.postRepository.findOneByOrFail({
      userId: userId,
      id: id,
    });
    this.postRepository.softDelete(post.id);

    return post;
  }
}
