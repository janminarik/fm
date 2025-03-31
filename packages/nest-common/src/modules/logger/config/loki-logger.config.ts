import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import {
  BaseLoggerConfig,
  BaseLoggerEnvVarsValidationSchema,
  createBaseLoggerConfig,
} from "./logger.config";
import { validateConfig } from "../../../utils";
import { LoggerConfigProvider } from "../types/logger-config-provider";

export const LOKI_LOGGER_CONFIG = "LOKI_LOGGER_CONFIG";

export interface LokiLoggerConfig extends BaseLoggerConfig {
  host: string;
  batching: boolean;
}

export class LokiLoggerEnvVarsValidationSchema extends BaseLoggerEnvVarsValidationSchema {
  @IsString()
  @IsNotEmpty()
  LOKI_HOST: string;

  @IsString()
  @IsOptional()
  LOKI_BATCHING: string;
}

export const lokiLoggerConfigProvider: LoggerConfigProvider<LokiLoggerConfig> =
  {
    namespace: "loki-logger",
    provideToken: LOKI_LOGGER_CONFIG,
    configFactory: () => {
      validateConfig(process.env, LokiLoggerEnvVarsValidationSchema);
      return {
        ...createBaseLoggerConfig(),
        host: process.env.LOKI_HOST,
        batching: false,
      };
    },
  };
