import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({ email });
  }
}
