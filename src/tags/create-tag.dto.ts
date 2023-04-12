import { IsNotEmpty, MaxLength } from 'class-validator';
import { EntityConstant } from '../shared/constants/entity.constant';

export class CreateTagDto {
  @IsNotEmpty()
  @MaxLength(EntityConstant.shortLength)
  name: string;
}
