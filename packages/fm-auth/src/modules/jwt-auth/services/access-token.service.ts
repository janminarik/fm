import { Inject, Injectable } from "@nestjs/common";
import { type IUserRepository, USER_REPOSITORY } from "@repo/fm-domain";
import { addMilliseconds } from "date-fns";

import { AUTH_CONFIG, type JwtAuthConfig } from "../config";
import { IJwtOptions } from "../interfaces/jwt.interfaces";
import { AuthToken } from "../types/auth-token";
import { createUnixTimespan, generateJti } from "../utils";
import { JwtWrapperService } from "./jwt-wrapper.service";

export const ACCESS_TOKEN_SERVICE = Symbol("ACCESS_TOKEN_SERVICE");

export interface IAccessTokenService {
  createToken(userId: string): Promise<AuthToken>;
}

@Injectable()
export class AccessTokenService implements IAccessTokenService {
  private secretKey: string;
  private expirationTime: number;
  private audience: string;
  private issuer: string;

  constructor(
    @Inject(AUTH_CONFIG) private readonly config: JwtAuthConfig,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtWrapperService,
  ) {
    this.issuer = this.config.issuer;

    this.audience = this.config.audience;
    this.secretKey = this.config.accessTokenSecret;
    this.expirationTime = this.config.accessTokenExpiresIn;
  }

  async createToken(userId: string): Promise<AuthToken> {
    const now = new Date();

    const expiresAt = createUnixTimespan(
      addMilliseconds(now.getTime(), this.expirationTime * 10000),
    );

    const payload = {
      userId,
      iat: createUnixTimespan(now),
      jti: generateJti(),
    };

    const options: IJwtOptions = {
      secretKey: this.secretKey,
      expiresIn: this.expirationTime,
      audience: this.audience,
      issuer: this.issuer,
      subject: userId,
    };

    const token = await this.jwtService.jwtEncrypt(payload, options);

    return {
      token,
      expiresAt,
    };
  }
}
