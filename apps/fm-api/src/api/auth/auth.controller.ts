import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  type IRenewTokenService,
  JwtAccessGuard,
  JwtPayload,
  JwtRefreshGuard,
  JwtRefreshPayloadDto,
  RENEW_TOKEN_SERVICE,
} from "@repo/fm-auth";

import CookieAuthentication from "./decorators/cookie-auth.decorator";
import {
  AuthCheckAuthDoc,
  AuthLoginDoc,
  AuthLogoutDoc,
  AuthRefreshTokenDoc,
  AuthRotateRefreshTokenDoc,
} from "./doc/auth.doc";
import { LoginRequestDto } from "./dto";
import { AuthTokenPairDto } from "./dto/auth-token-pair.dto";
import { AuthService } from "./services/auth.service";

@Controller({ version: "1", path: "auth" })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(RENEW_TOKEN_SERVICE)
    private readonly renewTokenService: IRenewTokenService,
  ) {}

  @AuthLoginDoc()
  @Throttle({ short: { limit: 2, ttl: 1000 }, long: { limit: 5, ttl: 60000 } })
  @HttpCode(200)
  @Post("/login")
  @CookieAuthentication("login")
  async login(
    @Body() { email, password }: LoginRequestDto,
  ): Promise<AuthTokenPairDto> {
    return await this.authService.login(email, password);
  }

  @AuthLogoutDoc()
  @UseGuards(JwtAccessGuard)
  @Post("/logout")
  @CookieAuthentication("logout")
  async logout(): Promise<void> {}

  @AuthRotateRefreshTokenDoc()
  @UseGuards(JwtRefreshGuard)
  @Post("/refresh-tokens")
  @HttpCode(200)
  @CookieAuthentication("refresh-tokens")
  async refreshTokens(
    @JwtPayload() { userId, token }: JwtRefreshPayloadDto,
  ): Promise<AuthTokenPairDto> {
    const { accessToken, refreshToken } =
      await this.renewTokenService.generateTokenPair(userId, token);

    return {
      accessToken: accessToken.token,
      accessTokenExpiresAt: accessToken.expiresAt,
      refreshToken: refreshToken.token,
      refreshTokenExpiresAt: refreshToken.expiresAt,
    };
  }

  @AuthRefreshTokenDoc()
  @UseGuards(JwtRefreshGuard)
  @Post("/refresh-access-token")
  @HttpCode(200)
  @CookieAuthentication("refresh-access-token")
  async refreshAccessToken(
    @JwtPayload() { userId, token }: JwtRefreshPayloadDto,
  ): Promise<AuthTokenPairDto> {
    const { accessToken, refreshToken } =
      await this.renewTokenService.generateAccessToken(userId, token);

    return {
      accessToken: accessToken.token,
      accessTokenExpiresAt: accessToken.expiresAt,
      refreshToken: refreshToken.token,
      refreshTokenExpiresAt: refreshToken.expiresAt,
    };
  }

  @AuthCheckAuthDoc()
  @UseGuards(JwtAccessGuard)
  @Get("/checkAuth")
  checkAuth() {
    return { isAuthenticated: true };
  }
}
