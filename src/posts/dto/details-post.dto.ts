import { Expose, Type } from 'class-transformer';

import { Tag } from '../../tags/tag.dto';

export class DetailsPostDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  userId: string;

  @Expose()
  fileName: string;

  @Expose()
  @Type(() => Tag)
  tags: Tag[];
}
