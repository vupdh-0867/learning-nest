import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.manager);
  }
}
