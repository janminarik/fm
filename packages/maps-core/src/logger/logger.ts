import pino, { DestinationStream, TransportTargetOptions } from "pino";

import { createPinoPretty } from "./transports";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LoggerOptions {
  level: LogLevel;
  targets?: TransportTargetOptions[];
}

export interface ILogger {
  debug: (message: string, meta?: object) => void;
  info: (message: string, meta?: object) => void;
  warn: (message: string, meta?: object) => void;
  error: (message: string, error?: Error | object, meta?: object) => void;
}

export class Logger implements ILogger {
  private logger: pino.Logger;
  private static instance: Logger;

  private constructor(options: LoggerOptions) {
    const transport: DestinationStream = pino.transport({
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

  debug(message: string, meta?: object) {
    this.logger.debug({ ...meta, msg: message });
  }

  info(message: string, meta?: object) {
    this.logger.info({ ...meta, msg: message });
  }

  warn(message: string, meta?: object) {
    this.logger.warn({ ...meta, msg: message });
  }

  error(message: string, meta?: object) {
    this.logger.error({ ...meta, msg: message });
  }
}

// TODO: Refactor options to use optimal parameters
export const createLogger = (options: LoggerOptions): ILogger => {
  return Logger.getInstance(options);
};
