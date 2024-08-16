import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

type Payload = {
  sub: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      expiresIn: '3d',
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Payload) {
    return await this.userService.findOne(payload.sub);
  }
}
