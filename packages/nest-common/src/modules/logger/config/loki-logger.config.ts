import { IsNotEmpty, IsString } from "class-validator";

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
}

export const lokiLoggerConfigProvider: LoggerConfigProvider<LokiLoggerConfig> =
  {
    namespace: "loki-logger",
    provideToken: LOKI_LOGGER_CONFIG,
    configFactory: () => {
      validateConfig(process.env, LokiLoggerEnvVarsValidationSchema);
      return {
        ...createBaseLoggerConfig(),
        host: process.env.LOKI_HOST || "http://localhost:3100",
        batching: false,
      };
    },
  };
