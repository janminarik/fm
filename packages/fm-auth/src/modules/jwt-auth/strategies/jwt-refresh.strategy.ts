import { Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AUTH_CONFIG, type JwtAuthConfig } from "../config";
import { JwtRefreshPayloadDto } from "../dto";
import {
  AuthTokenExtractorService,
  type IRefreshTokenService,
  REFRESH_TOKEN_SERVICE,
} from "../services";

export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  //TODO: miesto configu in injectovat enviromentService
  constructor(
    @Inject(AUTH_CONFIG) config: JwtAuthConfig,
    private jwtExtractorService: AuthTokenExtractorService,
    @Inject(REFRESH_TOKEN_SERVICE)
    private refreshTokenService: IRefreshTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => jwtExtractorService.extractRefreshToken(req),
      ]),
      ignoreExpiration: false,

      jsonWebTokenOptions: {
        ignoreNotBefore: true,
        audience: config.audience,
        issuer: config.issuer,
      },
      secretOrKey: config.refreshTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    tokenPayload: JwtRefreshPayloadDto,
  ): Promise<JwtRefreshPayloadDto> {
    const token = this.jwtExtractorService.extractRefreshToken(req);

    await this.refreshTokenService.validateToken(token);

    return { ...tokenPayload, token };
  }
}
