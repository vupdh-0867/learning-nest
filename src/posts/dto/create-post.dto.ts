import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { EntityConstant } from '../../shared/constants/entity.constant';
import { CreateTagDto } from '../../tags/dto/create-tag.dto';

export class CreatePostDto {
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MaxLength(EntityConstant.shortLength)
  title: string;

  @IsOptional()
  @MaxLength(EntityConstant.longLength)
  description: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  tags: CreateTagDto[];

  @IsOptional()
  fileName: string;

  constructor(
    title: string,
    description: string,
    fileName?: string,
    tags?: CreateTagDto[],
  ) {
    this.title = title;
    this.description = description;
    this.fileName = fileName || '';
    this.tags = tags || [];
  }
}
