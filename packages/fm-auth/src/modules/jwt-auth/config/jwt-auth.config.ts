import { Provider } from "@nestjs/common";
import { ConfigService, registerAs } from "@nestjs/config";
import { Environment, validateConfig } from "@repo/nest-common";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import ms from "ms";

export const AUTH_CONFIG = "AUTH_CONFIG";
export const AUTH_CONFIG_NAMESPACE = "auth";

export type JwtAuthConfig = {
  appName: string;
  nodeEnv: string;
  issuer: string;
  audience: string;
  accessTokenSecret: string;
  accessTokenExpiresIn: number;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: number;
};

class JwtAuthEnvironmentVariablesValidationSchema {
  @IsString()
  @IsNotEmpty()
  API_NAME: string;

  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsString()
  @IsNotEmpty()
  AUTH_JWT_ACCESS_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  AUTH_JWT_REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: string;
}

export const jwtAuthConfig = registerAs<JwtAuthConfig>(
  AUTH_CONFIG_NAMESPACE,
  () => {
    validateConfig(process.env, JwtAuthEnvironmentVariablesValidationSchema);

    return {
      appName: process.env.API_NAME,
      nodeEnv: process.env.NODE_ENV || Environment.DEVELOPMENT,

      issuer: process.env.AUTH_JWT_ISSUER,
      audience: process.env.AUTH_JWT_AUDIENCE,

      accessTokenSecret: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET,
      accessTokenExpiresIn:
        ms(process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN) / 1000,

      refreshTokenSecret: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET,
      refreshTokenExpiresIn:
        ms(process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN) / 1000,
    };
  },
);

export const jwyAuthConfigService: Provider = {
  inject: [ConfigService],
  provide: AUTH_CONFIG,
  useFactory: (configService: ConfigService) =>
    configService.get<JwtAuthConfig>(AUTH_CONFIG_NAMESPACE),
};
