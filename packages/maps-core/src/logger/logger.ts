import pino, { TransportTargetOptions } from "pino";

import { createPinoLoki, createPinoPretty } from "./transports";

export interface LoggerOptions {
  level: "debug" | "info" | "warn" | "error";
  targets?: TransportTargetOptions[];
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

  private constructor(options: LoggerOptions) {
    const transport = pino.transport({
      targets: options.targets ?? [createPinoPretty(options.level)],
    });

    this.logger = pino({ level: options.level }, transport);
  }

  public static getInstance(options: LoggerOptions): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(options);
    }
    return Logger.instance;
  }

  debug(message: string, meta?: Record<string, any>) {
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
    //TODO: proces.env
    const level = "info";

    const pinoPretty = createPinoPretty(level);

    const pinoLoki = createPinoLoki(level, {
      host: "http://localhost:3100",
      labels: { app: "maps-core" },
      batch: false,
    });

    const targets: TransportTargetOptions[] = [pinoPretty, pinoLoki];

    const options: LoggerOptions = {
      level,
      targets,
    };

    return Logger.getInstance(options);
  }
};
