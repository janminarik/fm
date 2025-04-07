import {
  createLogger,
  createPinoLoki,
  createPinoPretty,
  ILogger,
  LoggerOptions,
  LogLevel,
  PinoLokiLoggerOptions,
} from "../../src/logger";

const app = "maps-core";
const logLevel = process.env.API_LOG_LEVEL as string;

export const testPinoLokiOptions: PinoLokiLoggerOptions = {
  host: process.env.LOKI_HOST as string,
  labels: { app },
  batch: false,
};

export const testLoggerOptions: LoggerOptions = {
  level: (process.env.API_LOG_LEVEL as LogLevel) || "debug",
  targets: [
    createPinoPretty(logLevel),
    createPinoLoki(logLevel, testPinoLokiOptions),
  ],
};

export function createTestLogger() {
  return createLogger(testLoggerOptions);
}
