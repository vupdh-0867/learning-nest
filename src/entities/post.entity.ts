import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { EntityConstant } from "src/shared/constants/entity.constant";
import { Tag } from "./tag.entity";

@Entity('posts')
export class Post extends Base {
    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({name: 'user_id'})
    user: User;

    @OneToMany(() => Tag, (tag) => tag.post)
    tags: Tag[]

    @Column({
      type: 'uuid',
      name: 'user_id',
      nullable: false,
    })
    userId: string;

    @Column({
    type: 'varchar',
    name: 'title',
    length: EntityConstant.shortLength,
    nullable: false,
    unique: true,
    })
    title: string;

    @Column({
    type: 'varchar',
    name: 'description',
    length: EntityConstant.longLength,
    nullable: true,
    })
    description: string;
}
