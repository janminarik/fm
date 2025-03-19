import { Inject, Injectable } from "@nestjs/common";
import { Request, Response } from "express";

import {
  AUTH_CONFIG,
  JWT_COOKIE_OPTIONS,
  JWT_COOKIES,
  JwtAuthConfig,
} from "../config";
import { AuthTokenPair } from "../types/auth-token";

@Injectable()
export class AuthCookieService {
  private appName: string;
  private accessTokenCookieName;
  private refreshTokenCookieName;

  constructor(@Inject(AUTH_CONFIG) private config: JwtAuthConfig) {
    this.appName = this.config.appName.trim().toLowerCase();

    this.accessTokenCookieName = JWT_COOKIE_OPTIONS.secure
      ? `__Secure-${this.appName}_${JWT_COOKIES.ACCESS}`
      : `${this.appName}_${JWT_COOKIES.ACCESS}`;

    this.refreshTokenCookieName = JWT_COOKIE_OPTIONS.secure
      ? `__Secure-${this.appName}_${JWT_COOKIES.REFRESH}`
      : `${this.appName}_${JWT_COOKIES.REFRESH}`;
  }

  getAccessTokenCookieName = () => this.accessTokenCookieName;

  getRefreshTokenCookieName = () => this.refreshTokenCookieName;

  getAccessToken = (request: Request): string =>
    request?.cookies?.[this.accessTokenCookieName];

  getRefreshToken = (request: Request): string =>
    request?.cookies?.[this.refreshTokenCookieName];

  setCookie(response: Response, tokenPair: AuthTokenPair) {
    const { accessToken, refreshToken } = tokenPair;

    response.cookie(this.accessTokenCookieName, accessToken.token, {
      ...JWT_COOKIE_OPTIONS,
      expires: new Date(accessToken.expiresAt * 1000),
    });

    response.cookie(this.refreshTokenCookieName, refreshToken.token, {
      ...JWT_COOKIE_OPTIONS,
      expires: new Date(refreshToken.expiresAt * 1000),
    });
  }

  clearCookie(response: Response) {
    response.clearCookie(this.accessTokenCookieName, { ...JWT_COOKIE_OPTIONS });
    response.clearCookie(this.refreshTokenCookieName, {
      ...JWT_COOKIE_OPTIONS,
    });
  }
}
