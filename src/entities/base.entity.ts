import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { EntityConstant } from '../shared/constants/entity.constant';

export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn({ precision: EntityConstant.timePrecision })
  updated: Date;

  @CreateDateColumn({ precision: EntityConstant.timePrecision })
  created: Date;

  @Exclude()
  @DeleteDateColumn({
    type: 'timestamp',
    precision: EntityConstant.timePrecision,
  })
  deleted: Date;
}
