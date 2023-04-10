import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { Post } from "./post.entity";
import { EntityConstant } from "src/shared/constants/entity.constant";

@Entity('tags')
export class Tag extends Base {
  @ManyToOne(() => Post, (post) => post.tags)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({
    type: 'uuid',
    name: 'post_id',
    nullable: false,
  })
  postId: string;

  @Column({
    type: 'varchar',
    name: 'name',
    length: EntityConstant.shortLength
  })
  name: string
}
