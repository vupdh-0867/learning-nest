import { BadRequestException, Injectable } from "@nestjs/common";
import { Post } from "src/entities/post.entity";
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { CreatePostDto } from "./dto/create-post.dto";
import { Tag } from "src/entities/tag.entity";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.manager);
  }

  async createPostAndTags(postDto: CreatePostDto | UpdatePostDto, userId: string): Promise<Post> {
    return await this.dataSource.transaction(async manager => {
      const post = await manager.save(Post, {...postDto, userId});
      post.tags = await manager.save(Tag, postDto.tags.map((tag) => ({ postId: post.id, ...tag })));

      return post;
    });
  }

  async findOneByOrFail(whereOpts: FindOptionsWhere<Post> | FindOptionsWhere<Post>[]): Promise<Post> {
    const post = await this.findOneBy(whereOpts);
    if (!post) {
      throw new BadRequestException([`This ${Post.name} does not exist!`]);
    }
    return post;
  }
}
