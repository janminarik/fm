import { BaseLoggerConfig } from "@repo/nest-common";
import { TransportTargetOptions } from "pino";

export const createPinoPretty = (
  config: BaseLoggerConfig,
): TransportTargetOptions => {
  return {
    target: "pino-pretty",
    level: config.logLevel,
    options: { colorize: true, singleLine: false },
  };
};
