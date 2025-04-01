import { IsOptional, IsString } from "class-validator";

import {
  BaseLoggerConfig,
  BaseLoggerEnvVarsValidationSchema,
  createBaseLoggerConfig,
} from "./logger.config";
import { validateConfig } from "../../../utils";
import { LoggerConfigProvider } from "../types/logger-config-provider";

export const FILE_LOGGER_CONFIG = "FILE_LOGGER_CONFIG";

export interface FileLoggerConfig extends BaseLoggerConfig {
  logDir: string;
  logSize: string;
}

export class FileLoggerEnvVarsValidationSchema extends BaseLoggerEnvVarsValidationSchema {
  @IsString()
  @IsOptional()
  API_LOG_DIR: string;

  @IsString()
  @IsOptional()
  API_LOG_SIZE: string;
}

export const fileLoggerConfigProvider: LoggerConfigProvider<FileLoggerConfig> =
  {
    namespace: "file-logger",
    provideToken: FILE_LOGGER_CONFIG,
    configFactory: () => {
      const config = validateConfig(
        process.env,
        FileLoggerEnvVarsValidationSchema,
      );
      return {
        ...createBaseLoggerConfig(config),
        logDir: config.API_LOG_DIR,
        logSize: config.API_LOG_SIZE,
      };
    },
  };
