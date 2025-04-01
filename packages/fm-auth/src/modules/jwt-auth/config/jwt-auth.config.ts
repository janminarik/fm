import { Provider } from "@nestjs/common";
import { ConfigService, registerAs } from "@nestjs/config";
import {
  BaseLoggerEnvVarsValidationSchema,
  createBaseLoggerConfig,
  validateConfig,
} from "@repo/nest-common";
import { IsNotEmpty, IsString } from "class-validator";

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

class JwtAuthEnvironmentVariablesValidationSchema extends BaseLoggerEnvVarsValidationSchema {
  @IsString()
  @IsNotEmpty()
  AUTH_JWT_ISSUER: string;

  @IsString()
  @IsNotEmpty()
  AUTH_JWT_AUDIENCE: string;

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

function parseTimeToSeconds(timeStr: string): number {
  const value = parseInt(timeStr); // extrahuje číslo (15)
  const unit = timeStr.slice(-1); // extrahuje jednotku ("d", "m", "s", "h")

  switch (unit) {
    case "s":
      return value; // sekundy
    case "m":
      return value * 60; // minúty na sekundy
    case "h":
      return value * 3600; // hodiny na sekundy
    case "d":
      return value * 86400; // dni na sekundy (24 * 60 * 60)
    default:
      throw new Error("Neznáma jednotka");
  }
}

export const jwtAuthConfig = registerAs<JwtAuthConfig>(
  AUTH_CONFIG_NAMESPACE,
  () => {
    const config = validateConfig(
      process.env,
      JwtAuthEnvironmentVariablesValidationSchema,
    );

    return {
      ...createBaseLoggerConfig(config),
      issuer: config.AUTH_JWT_ISSUER,
      audience: config.AUTH_JWT_AUDIENCE,
      accessTokenSecret: config.AUTH_JWT_ACCESS_TOKEN_SECRET,
      accessTokenExpiresIn: parseTimeToSeconds(
        config.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN,
      ),
      refreshTokenSecret: config.AUTH_JWT_REFRESH_TOKEN_SECRET,
      refreshTokenExpiresIn: parseTimeToSeconds(
        config.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN,
      ),
    };
  },
);

export const jwyAuthConfigService: Provider = {
  inject: [ConfigService],
  provide: AUTH_CONFIG,
  useFactory: (configService: ConfigService) =>
    configService.get<JwtAuthConfig>(AUTH_CONFIG_NAMESPACE),
};
