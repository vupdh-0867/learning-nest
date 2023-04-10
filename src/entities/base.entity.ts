  import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Exclude, Expose } from 'class-transformer';
  import { EntityConstant } from '../shared/constants/entity.constant';
  export const GROUP_TIME = 'group_time';

  export abstract class Base {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose({ groups: [GROUP_TIME]})
    @UpdateDateColumn({ precision: EntityConstant.timePrecision })
    updated: Date;

    @Expose({ groups: [GROUP_TIME]})
    @CreateDateColumn({ precision: EntityConstant.timePrecision })
    created: Date;

    @Exclude()
    @DeleteDateColumn({
      type: 'timestamp',
      precision: EntityConstant.timePrecision,
    })
    deleted: Date;
  }
