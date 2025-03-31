import { Inject, UnauthorizedException } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import {
  ACCESS_TOKEN_SERVICE,
  type IAccessTokenService,
  type IRefreshTokenService,
  REFRESH_TOKEN_SERVICE,
} from "@repo/fm-auth";
import { type IUserRepository, USER_REPOSITORY } from "@repo/fm-domain";
import { HASH_SERVICE, type IHashService } from "@repo/fm-shared";

import { AuthTokenPairDto } from "../dto/auth-token-pair.dto";

export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHashService,
    @Inject(ACCESS_TOKEN_SERVICE)
    private readonly accessTokenService: IAccessTokenService,
    @Inject(REFRESH_TOKEN_SERVICE)
    private readonly refreshTokenService: IRefreshTokenService,
  ) {}

  @Transactional()
  async login(email: string, password: string): Promise<AuthTokenPairDto> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const authenticated = await this.verifyUserPassword(
      password,
      user.passwordHash,
    );

    if (!authenticated) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessTokenResult = await this.accessTokenService.createToken(
      user.id,
    );
    const refreshTokenResult = await this.refreshTokenService.createToken(
      user.id,
    );
    return {
      accessToken: accessTokenResult.token,
      accessTokenExpiresAt: accessTokenResult.expiresAt,
      refreshToken: refreshTokenResult.token,
      refreshTokenExpiresAt: refreshTokenResult.expiresAt,
    };
  }

  async verifyUserPassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    const authenticated = await this.hashService.compare(
      password,
      passwordHash,
    );
    return authenticated;
  }
}
