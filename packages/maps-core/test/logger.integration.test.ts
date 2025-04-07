import {
  jest,
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import { createLogger, LoggerOptions } from "../src/logger/logger";

describe("Logger", () => {
  it("should log message", async () => {
    const loggerConfig: LoggerOptions = {
      lokiUrl: "http://localhost:3100",
      lokiLabels: {
        app: "maps-core",
        env: "development",
      },
      level: "debug",
    };

    const logger = createLogger(loggerConfig);

    logger.debug("-------------------------- test message");
  });
});
