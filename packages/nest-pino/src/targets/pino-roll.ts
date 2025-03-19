import { join } from "path";

import { FileLoggerConfig } from "@repo/nest-common";
import { TransportTargetOptions } from "pino";

export const createPinoRoll = (
  config: FileLoggerConfig,
): TransportTargetOptions => {
  const logDir = config.logDir || "logs";

  const logFile = logDir ? join(config.logDir, "log") : undefined;
  return {
    target: "pino-roll",
    level: config.logLevel,
    options: {
      file: logFile,
      frequency: "daily",
      mkdir: true,
      size: "100", //100mb
      dateFormat: "yyyy-MM-dd",
    },
  };
};
