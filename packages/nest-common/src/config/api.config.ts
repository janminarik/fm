import { Provider } from "@nestjs/common";
import { ConfigService, registerAs } from "@nestjs/config";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from "class-validator";

import { ApiConfig } from "./api-config.type";
import { Environment } from "../constants/app.constant";
import { validateConfig } from "../utils/config.utils";

export const API_CONFIG_NAMESPACE = "app";
export const API_CONFIG = "API_CONFIG";

class ApiEnvironmentVariablesValidationSchema {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsString()
  @IsOptional()
  API_NAME: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  API_PORT: number;

  @IsBoolean()
  @IsOptional()
  API_DEBUG: boolean;

  @IsString()
  @Matches(
    /^(true|false|\*|([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)?(,([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)*$/,
  )
  @IsOptional()
  API_CORS_ORIGIN: string;

  @IsBoolean()
  @IsOptional()
  API_DOCS_ENABLED: boolean;

  @IsString()
  @IsOptional()
  API_BODY_JSON_MAX_SIZE: string;

  @IsString()
  @IsOptional()
  API_BODY_URLENCODED_MAX_SIZE: string;

  @IsString()
  @IsOptional()
  API_BODY_TEXT_MAX_SIZE: string;

  @IsString()
  @IsOptional()
  API_BODY_RAW_MAX_SIZE: string;
}

export const apiConfig = registerAs<ApiConfig>(API_CONFIG_NAMESPACE, () => {
  const config = validateConfig(
    process.env,
    ApiEnvironmentVariablesValidationSchema,
  );

  return {
    nodeEnv: config.NODE_ENV || Environment.DEVELOPMENT,
    name: config.API_NAME,
    port: config.API_PORT ? config.API_PORT : 3000,
    debug: config.API_DEBUG,
    corsOrigin: getCorsOrigin(),
    apiDocsEnabled: config.API_DOCS_ENABLED,
    bodyJsonMaxSize: config.API_BODY_JSON_MAX_SIZE || "1mb",
    bodyUrlEncodedMaxSize: config.API_BODY_URLENCODED_MAX_SIZE || "1mb",
    bodyUrlTextMaxSize: config.API_BODY_TEXT_MAX_SIZE || "1mb",
    bodyUrlRawMaxSize: config.API_BODY_RAW_MAX_SIZE || "1mb",
  };
});

export const apiConfigService: Provider = {
  inject: [ConfigService],
  provide: API_CONFIG,
  useFactory: (configService: ConfigService) =>
    configService.get<ApiConfig>(API_CONFIG_NAMESPACE),
};

function getCorsOrigin() {
  const corsOrigin = process.env.API_CORS_ORIGIN;

  if (corsOrigin === "true") return true;
  if (corsOrigin === "*") return "*";
  if (!corsOrigin || corsOrigin === "false") return false;

  return corsOrigin.split(",").map((origin) => origin.trim());
}
