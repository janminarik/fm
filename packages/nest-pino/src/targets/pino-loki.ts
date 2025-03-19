import { LokiLoggerConfig } from "@repo/nest-common";
import { TransportTargetOptions } from "pino";

export const createPinoLoki = (
  config: LokiLoggerConfig,
): TransportTargetOptions => {
  return {
    target: "pino-loki",
    options: {
      batching: config.batching,
      labels: { application: config.appName },
      host: config.host,
    },
  };
};
