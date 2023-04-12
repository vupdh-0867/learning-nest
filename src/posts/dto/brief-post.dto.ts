import { Expose } from 'class-transformer';

export class BriefPostDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;
}
