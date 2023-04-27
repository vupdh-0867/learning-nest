import {
  Request,
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  UseGuards,
  Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Serializer } from '../decorators/serializer.decorator';
import { UserDto } from '../user/dtos/user.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() { user }: { user: User }) {
    return this.authService.login(user);
  }

  @Post('register')
  @Serializer(UserDto)
  @HttpCode(HttpStatus.CREATED)
  async addUser(@Body() userDto: UserDto) {
    return this.userService.create(userDto);
  }
}
