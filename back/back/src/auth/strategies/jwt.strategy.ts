import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'temporary_secretkey',
    });
  }

  async validate(payload: any) {
    console.log('[JwtStrategy][VALIDATE] Token payload:', payload);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
