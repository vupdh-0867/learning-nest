import { Expose } from 'class-transformer';

export class Tag {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
