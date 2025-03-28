import { Inject, Injectable } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import {
  APP_TOKEN_REPOSITORY,
  IAppTokenRepository,
  IUserRepository,
  USER_REPOSITORY,
} from "@repo/fm-domain";

import { JwtRefreshPayloadDto } from "../dto";
import {
  ACCESS_TOKEN_SERVICE,
  IAccessTokenService,
} from "./access-token.service";
import { JwtWrapperService } from "./jwt-wrapper.service";
import {
  IRefreshTokenService,
  REFRESH_TOKEN_SERVICE,
} from "./refresh-token.service";
import { AuthTokenPair } from "../types/auth-token";

export const RENEW_TOKEN_SERVICE = Symbol("RENEW_TOKEN_SERVICE");

export interface IRenewTokenService {
  generateAccessToken(
    userId: string,
    refreshTokenFromReq: string,
  ): Promise<AuthTokenPair>;
  generateTokenPair(
    userId: string,
    refreshTokenFromReq: string,
  ): Promise<AuthTokenPair>;
}

@Injectable()
export class RenewTokenService implements IRenewTokenService {
  constructor(
    @Inject(ACCESS_TOKEN_SERVICE)
    private readonly accessTokenService: IAccessTokenService,
    @Inject(REFRESH_TOKEN_SERVICE)
    readonly refreshTokenService: IRefreshTokenService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(APP_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IAppTokenRepository,
    private readonly jwtService: JwtWrapperService,
  ) {}

  @Transactional()
  async generateAccessToken(
    userId: string,
    refreshTokenFromReq: string,
  ): Promise<AuthTokenPair> {
    await this.refreshTokenService.validateToken(refreshTokenFromReq);

    const accessToken = await this.accessTokenService.createToken(userId);

    const refreshTokenPayload =
      this.jwtService.jwtDecrypt<JwtRefreshPayloadDto>(refreshTokenFromReq);

    return {
      accessToken: accessToken,
      refreshToken: {
        token: refreshTokenFromReq,
        expiresAt: refreshTokenPayload.exp,
      },
    };
  }

  @Transactional()
  async generateTokenPair(
    userId: string,
    refreshTokenFromReq: string,
  ): Promise<AuthTokenPair> {
    const user = await this.userRepository.findById(userId);

    await this.refreshTokenService.validateToken(refreshTokenFromReq);

    const accessToken = await this.accessTokenService.createToken(userId);

    const refreshToken = await this.refreshTokenService.createToken(userId);

    const refreshTokenPayload =
      this.jwtService.jwtDecrypt<JwtRefreshPayloadDto>(refreshTokenFromReq);

    await this.refreshTokenRepository.revokeToken(
      user.id,
      refreshTokenPayload.jti,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
