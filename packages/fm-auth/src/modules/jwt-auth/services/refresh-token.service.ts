import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import {
  APP_TOKEN_REPOSITORY,
  AppTokenType,
  USER_REPOSITORY,
  User,
  type IAppTokenRepository,
  type IUserRepository,
} from "@repo/fm-domain";
import { HASH_SERVICE } from "@repo/fm-shared";
import { generateId } from "@repo/nest-common";
import { addMilliseconds } from "date-fns";

import { AUTH_CONFIG, type JwtAuthConfig } from "../config";
import { JwtRefreshPayloadDto } from "../dto";
import { AuthToken } from "../types/auth-token";
import { createUnixTimespan } from "../utils";
import { JwtWrapperService } from "./jwt-wrapper.service";
import { IJwtOptions } from "../interfaces/jwt.interfaces";

import type { IHashService } from "@repo/fm-shared";

export const REFRESH_TOKEN_SERVICE = Symbol("REFRESH_TOKEN_SERVICE");

export interface IRefreshTokenService {
  createToken(userId: string): Promise<AuthToken>;
  validateToken(token: string): Promise<User>;
  revokeToken(token: string): Promise<void>;
}

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  private audience: string;
  private issuer: string;
  private secretKey: string;
  private expirationTime: number;

  constructor(
    @Inject(AUTH_CONFIG) private readonly config: JwtAuthConfig,
    @Inject(APP_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IAppTokenRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHashService,
    private readonly jwtService: JwtWrapperService,
  ) {
    this.issuer = this.config.issuer;
    this.audience = this.config.audience;
    this.secretKey = this.config.refreshTokenSecret;
    this.expirationTime = this.config.refreshTokenExpiresIn;
  }

  @Transactional()
  async createToken(userId: string): Promise<AuthToken> {
    const now = new Date();

    const expiresAt = createUnixTimespan(
      addMilliseconds(now.getTime(), this.expirationTime * 1000),
    );

    const payload = {
      userId: userId,
      iat: createUnixTimespan(now),
      jti: generateId(),
    };

    const options: IJwtOptions = {
      secretKey: this.secretKey,
      expiresIn: this.expirationTime,
      audience: this.audience,
      issuer: this.issuer,
      subject: userId,
    };

    const token = this.jwtService.jwtEncrypt({ ...payload }, options);

    await this.refreshTokenRepository.create({
      value: token,
      type: AppTokenType.RefreshToken,
      userId,
      publicId: payload.jti,
      expiresAt: now,
    });

    return {
      token,
      expiresAt,
    };
  }

  @Transactional()
  async validateToken(token: string): Promise<User> {
    const { userId, jti } =
      this.jwtService.jwtDecrypt<JwtRefreshPayloadDto>(token);

    const options: IJwtOptions = {
      secretKey: this.secretKey,
      expiresIn: this.expirationTime,
      audience: this.audience,
      issuer: this.issuer,
      subject: userId,
    };

    const isValid = this.jwtService.jwtVerify(token, options);

    if (!isValid) throw new UnauthorizedException("Invalid refresh token");

    const user = await this.userRepository.findById(userId);

    if (!user) throw new UnauthorizedException("User not found");

    if (!jti) {
      throw new UnauthorizedException("Token ID (jti) is missing");
    }

    const tokenRecord = await this.refreshTokenRepository.findToken(
      userId,
      jti,
    );

    if (!tokenRecord) {
      throw new UnauthorizedException(
        "Refresh token not found for this session",
      );
    }

    if (tokenRecord.revoked) {
      throw new UnauthorizedException("Refresh token is revoked");
    }
    return user;
  }

  @Transactional()
  async revokeToken(token: string) {
    const { userId, jti } =
      this.jwtService.jwtDecrypt<JwtRefreshPayloadDto>(token);

    if (!jti) {
      throw new UnauthorizedException("Token ID (jti) is missing");
    }
    await this.refreshTokenRepository.revokeToken(userId, jti);
  }
}
