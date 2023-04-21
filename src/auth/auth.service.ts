import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { AuthErrorConstant } from '../errors/auth-errors.constant';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, _password: string) {
    // TO-DO: apply verify user using bcrypt
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(AuthErrorConstant.wrongLoginInfo);
    }

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
