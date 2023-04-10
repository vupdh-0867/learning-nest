import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Post } from "src/entities/post.entity";
import { EntityConstant } from "src/shared/constants/entity.constant";
import { CreateTagDto } from 'src/tags/create-tag.dto';

export class CreatePostDto {
  static resorce = Post.name

  @IsNotEmpty()
  @MaxLength(EntityConstant.shortLength)
  title: string;

  @IsOptional()
  @MaxLength(EntityConstant.longLength)
  description: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  tags: CreateTagDto[];
}
