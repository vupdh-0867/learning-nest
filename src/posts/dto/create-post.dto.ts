import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { EntityConstant } from '../../shared/constants/entity.constant';
import { CreateTagDto } from '../../tags/create-tag.dto';

export class CreatePostDto {
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

  fileName: string;
}
