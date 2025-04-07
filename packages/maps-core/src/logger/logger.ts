import pino, { TransportTargetOptions } from "pino";

import { loggerConfig } from "./logger.config";

export interface LoggerOptions {
  lokiUrl?: string;
  lokiLabels?: Record<string, string>;
  level?: "debug" | "info" | "warn" | "error";
}

export interface ILogger {
  debug: (message: string, meta?: Record<string, any>) => void;
  info: (message: string, meta?: Record<string, any>) => void;
  warn: (message: string, meta?: Record<string, any>) => void;
  error: (message: string, meta?: Record<string, any>) => void;
}

export class Logger implements ILogger {
  private logger: pino.Logger;
  private static instance: Logger;

  private constructor(options: LoggerOptions = {}) {
    const { lokiUrl, lokiLabels, level } = options;

    const targets = [];

    const pinoPretty: TransportTargetOptions = {
      target: "pino-pretty",
      // level: level,
      options: { colorize: true, singleLine: false },
    };

    targets.push(pinoPretty);

    if (lokiUrl) {
      const pinoLoki: TransportTargetOptions = {
        target: "pino-loki",
        // level: level,
        options: {
          host: lokiUrl,
          labels: lokiLabels,
          batching: false,
        },
      };

      targets.push(pinoLoki);
    }

    const transport = pino.transport({
      targets,
    });

    this.logger = pino(
      {
        level: level,
      },
      transport,
    );
  }

  public static getInstance(options?: LoggerOptions): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(options);
    }
    return Logger.instance;
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(
      "-------------------------------------  YYYYYYYYYYYYYYYY",
    );
    this.logger.debug({ ...meta, msg: message });
  }

  info(message: string, meta?: Record<string, any>) {
    this.logger.info({ ...meta, msg: message });
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn({ ...meta, msg: message });
  }

  error(message: string, meta?: Record<string, any>) {
    this.logger.error({ ...meta, msg: message });
  }
}

export const createLogger = (options?: LoggerOptions): ILogger => {
  if (options) {
    return Logger.getInstance(options);
  } else {
    return Logger.getInstance(loggerConfig);
  }
};
