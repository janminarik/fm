import { describe, it } from "@jest/globals";
import { TransportTargetOptions } from "pino";
import {
  LoggerOptions,
  createLogger,
  createPinoLoki,
  createPinoPretty,
} from "../src/logger";
import { config } from "dotenv";
import { beforeAll } from "@jest/globals";
import {
  createTestLogger,
  testLoggerOptions,
  testPinoLokiOptions,
} from "./utils/test-logger";

describe("Logger", () => {
  beforeAll(() => {
    config({ path: "../../.env.test" });
  });

  it("should log message", async () => {
    const pinoPretty = createPinoPretty(testLoggerOptions.level);

    // const pinoLoki = createPinoLoki(
    //   testLoggerOptions.level,
    //   testPinoLokiOptions,
    // );

    // const targets: TransportTargetOptions[] = [pinoPretty, pinoLoki];

    // const loggerOptions: LoggerOptions = {
    //   level: testLoggerOptions.level,
    //   targets,
    // };

    const logger = createTestLogger();

    logger.debug("test message");
  });
});
