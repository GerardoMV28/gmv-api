import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { AUTH_COOKIE } from '../auth.constants';

function fromCookie(req: Request): string | null {
  if (req?.cookies && typeof req.cookies[AUTH_COOKIE] === 'string') {
    return req.cookies[AUTH_COOKIE];
  }
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        fromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: { sub: number; role: string }) {
    if (!payload?.sub) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, role: payload.role };
  }
}
