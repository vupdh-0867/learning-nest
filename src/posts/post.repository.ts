import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { Tag } from '../entities/tag.entity';
import { FileService } from '../multer/file.service';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly fileService: FileService,
  ) {
    super(Post, dataSource.manager);
  }

  async createPostAndTags(
    postDto: CreatePostDto | UpdatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<Post> {
    return await this.dataSource.transaction(async (manager) => {
      const post = await manager.save(Post, { ...postDto, userId });
      if (postDto.tags !== undefined) {
        post.tags = await manager.save(
          Tag,
          postDto.tags.map((tag) => ({ postId: post.id, ...tag })),
        );
      }
      if (file !== undefined) {
        const fileName = await this.fileService.uploadFile(file);
        await manager.save(Post, { id: post.id, fileName });
        post.fileName = fileName;
      }

      return post;
    });
  }

  async findOneByOrFail(
    whereOpts: FindOptionsWhere<Post> | FindOptionsWhere<Post>[],
  ): Promise<Post> {
    return await this.createQueryBuilder(Post.name)
      .leftJoinAndSelect('Post.tags', 'tags', 'tags.deleted IS NULL')
      .where(whereOpts)
      .getOne();
  }
}
