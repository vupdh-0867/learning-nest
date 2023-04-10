import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { EntityConstant } from "src/shared/constants/entity.constant";
import { Tag } from "./tag.entity";
import { Expose } from 'class-transformer';
export const GROUP_POST = 'group_post_details';
export const GROUP_ALL_POSTS = 'group_all_posts';

@Entity('posts')
export class Post extends Base {
    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({name: 'user_id'})
    user: User;

    @Expose({ groups: [GROUP_POST]})
    @OneToMany(() => Tag, (tag) => tag.post)
    tags: Tag[];

    @Expose({ groups: [GROUP_POST]})
    @Column({
      type: 'uuid',
      name: 'user_id',
      nullable: false,
    })
    userId: string;

    @Expose({ groups: [GROUP_ALL_POSTS, GROUP_POST]})
    @Column({
      type: 'varchar',
      name: 'title',
      length: EntityConstant.shortLength,
      nullable: false,
      unique: true,
    })
    title: string;

    @Expose({ groups: [GROUP_ALL_POSTS, GROUP_POST]})
    @Column({
      type: 'varchar',
      name: 'description',
      length: EntityConstant.longLength,
      nullable: true,
    })
    description: string;
}
