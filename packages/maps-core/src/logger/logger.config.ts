import { LoggerOptions } from "./logger";

export const loggerConfig: LoggerOptions = {
  lokiUrl: "http://localhost:3100",
  lokiLabels: {
    app: "maps-core",
    env: process.env.NODE_ENV || "development",
  },
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
};
