import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { CryptoModule, IBaseModuleOptions } from "@repo/fm-shared";
import { ClsModule } from "nestjs-cls";
import { JwtAuthConfig } from "./config";
import { AUTH_CONFIG } from "./config/jwt-auth.config";
import { AuthConfigModule } from "./jwt-auth-config.module";
import {
  ACCESS_TOKEN_SERVICE,
  AccessTokenService,
  AuthCookieService,
  AuthHeaderService,
  AuthTokenExtractorService,
  JwtWrapperService,
} from "./services";
import {
  REFRESH_TOKEN_SERVICE,
  RefreshTokenService,
} from "./services/refresh-token.service";
import {
  RENEW_TOKEN_SERVICE,
  RenewTokenService,
} from "./services/renew-token.service";
import { JwtAccessStrategy, JwtRefreshStrategy } from "./strategies";

@Module({})
export class JwtAuthModule {
  static forRootAsync(options?: IBaseModuleOptions): DynamicModule {
    return {
      module: JwtAuthModule,
      global: options?.global,
      imports: [
        ConfigModule,
        ClsModule,
        AuthConfigModule,
        CryptoModule,
        JwtModule.registerAsync({
          imports: [AuthConfigModule],
          inject: [AUTH_CONFIG],
          useFactory: (config: JwtAuthConfig) => {
            return {
              secret: config.accessTokenSecret,
              signOptions: {
                expiresIn: config.accessTokenExpiresIn,
              },
            };
          },
        }),
      ],
      providers: [
        JwtAccessStrategy,
        JwtRefreshStrategy,
        JwtWrapperService,
        AuthHeaderService,
        AuthCookieService,
        AuthTokenExtractorService,
        {
          provide: ACCESS_TOKEN_SERVICE,
          useClass: AccessTokenService,
        },
        {
          provide: REFRESH_TOKEN_SERVICE,
          useClass: RefreshTokenService,
        },
        {
          provide: RENEW_TOKEN_SERVICE,
          useClass: RenewTokenService,
        },
        ...(options?.providers ?? []),
      ],
      exports: [
        ACCESS_TOKEN_SERVICE,
        REFRESH_TOKEN_SERVICE,
        RENEW_TOKEN_SERVICE,
        AuthCookieService,
      ],
    };
  }
}
