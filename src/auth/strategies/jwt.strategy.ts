import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY_BASE,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(
      payload.email,
      payload.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
