
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import { Injectable } from '@nestjs/common';
// import { Request } from 'express';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "jwt-access") {
    constructor(private readonly config: ConfigService) {
      super({
        jwtFromRequest: 
        // ExtractJwt.fromExtractors(
        //   [
        //     JwtAccessStrategy.extractJwtFromCookies,
            ExtractJwt.fromAuthHeaderAsBearerToken(),
        //   ]
        // )
        // ,
        ignoreExpiraion: false,
        secretOrKey: config.get("jwt.secret.access"),
      });
    }

    async validate(payload: any) {
      return payload;
    }

    // private static extractJwtFromCookies(req: Request): string | null {
    //   if (
    //     req.cookies 
    //     && "access_token" in req.cookies
    //     && req.cookies.access_token.length > 0
    //   ) {
    //     return req.cookies.access_token;
    //   }
    //   return null
    // }
  
  }