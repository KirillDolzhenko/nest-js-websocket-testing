
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors(
        [
          JwtRefreshStrategy.extractJwtFromCookies,
          ExtractJwt.fromAuthHeaderAsBearerToken()
        ]
      ),
      ignoreExpiraion: false,
      secretOrKey: config.get("jwt.secret.refresh"),
    });
  }

  private static extractJwtFromCookies(req: Request): string | null {
    // console.log(req.cookies.refresh_token)

    console.log("DFFDFD")

    if (
      req.cookies 
      && "refresh_token" in req.cookies
      && req.cookies.refresh_token.length > 0
    ) {
      return req.cookies.refresh_token;
    }
    return null
  }

    async validate(payload: any) {
      return payload;
    }
  }