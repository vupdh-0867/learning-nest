import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { Tag } from '../entities/tag.entity';
import { FileService } from '../multer/file.service';
import { TagRepository } from '../tags/tag.repository';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly fileService: FileService,
    private readonly tagRepository: TagRepository,
  ) {
    super(Post, dataSource.manager);
  }

  async createPostAndTags(
    postDto: CreatePostDto | UpdatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<Post> {
    return await this.dataSource.transaction(async (manager) => {
      const { tags, ...postAttrs } = postDto;
      const post = await manager.save(Post, { ...postAttrs, userId });
      if (tags !== undefined) {
        const deletedTagIds = [];
        const newOrEditedTags = [];
        tags.forEach((tag) => {
          if (tag.deleted) deletedTagIds.push(tag.id);
          else newOrEditedTags.push({ postId: post.id, ...tag });
        });
        await manager.save(Tag, newOrEditedTags);
        await this.tagRepository.deleteByIds(deletedTagIds);
        post.tags = await manager.find(Tag, {
          where: { postId: post.id },
          order: { created: 'ASC' },
        });
      }
      if (file !== undefined) {
        const fileName = await this.fileService.uploadFile(file);
        await manager.save(Post, { id: post.id, fileName });
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
