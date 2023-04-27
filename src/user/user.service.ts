import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UserDto } from './dtos/user.dto';
import { User } from '../entities/user.entity';
import { hash } from '../shared/utils/bcypt.util';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({ email });
  }

  async create(userDto: UserDto): Promise<User> {
    userDto.password = await hash(userDto.password);
    return this.userRepo.save(userDto);
  }
}
