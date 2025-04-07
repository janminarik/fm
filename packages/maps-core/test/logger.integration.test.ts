import {
  jest,
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
// import { createLogger, LoggerOptions } from "../src/logger/logger";
import { TransportTargetOptions } from "pino";
import {
  LoggerOptions,
  createLogger,
  createPinoLoki,
  createPinoPretty,
} from "../src/logger";

describe("Logger", () => {
  it("should log message", async () => {
    const level = "debug";

    const pinoPretty = createPinoPretty(level);

    const pinoLoki = createPinoLoki(level, {
      host: "http://localhost:3100",
      labels: { app: "maps-core" },
      batch: false,
    });

    const targets: TransportTargetOptions[] = [pinoPretty, pinoLoki];

    const loggerOptions: LoggerOptions = {
      level,
      targets,
    };

    const logger = createLogger(loggerOptions);

    logger.debug("test message");
  });
});
