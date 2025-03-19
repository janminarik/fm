import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Environment } from "../../../constants/app.constant";
import { validateConfig } from "../../../utils";
import { LoggerConfigProvider } from "../types/logger-config-provider";

export const BASE_LOGGER_CONFIG = "BASE_LOGGER_CONFIG";

export interface BaseLoggerConfig {
  appName: string;
  nodeEnv: string;
  logLevel: string;
}

export class BaseLoggerEnvVarsValidationSchema {
  @IsString()
  @IsNotEmpty()
  API_NAME: string;

  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsString()
  @IsOptional()
  API_LOG_LEVEL: string;
}

export const createBaseLoggerConfig = () => {
  return {
    appName: process.env.API_NAME,
    nodeEnv: process.env.NODE_ENV || Environment.DEVELOPMENT,
    logLevel: process.env.API_LOG_LEVEL || "info",
  };
};

export const loggerConfigProvider: LoggerConfigProvider<BaseLoggerConfig> = {
  namespace: "logger",
  provideToken: BASE_LOGGER_CONFIG,
  configFactory: () => {
    validateConfig(process.env, BaseLoggerEnvVarsValidationSchema);
    return createBaseLoggerConfig();
  },
};
