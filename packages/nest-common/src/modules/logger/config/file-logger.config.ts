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
  LOG_DIR: string;

  @IsString()
  @IsOptional()
  LOG_SIZE: string;
}

export const fileLoggerConfigProvider: LoggerConfigProvider<FileLoggerConfig> =
  {
    namespace: "file-logger",
    provideToken: FILE_LOGGER_CONFIG,
    configFactory: () => {
      validateConfig(process.env, FileLoggerEnvVarsValidationSchema);
      return {
        ...createBaseLoggerConfig(),
        logDir: process.env.API_LOG_DIR,
        logSize: process.env.API_LOG_SIZE || "100mb",
      };
    },
  };
