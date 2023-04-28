import { IsNotEmpty, MaxLength } from 'class-validator';
import { EntityConstant } from '../../shared/constants/entity.constant';

export class CreateTagDto {
  id: string;

  @IsNotEmpty()
  @MaxLength(EntityConstant.shortLength)
  name: string;

  deleted: boolean;
}
