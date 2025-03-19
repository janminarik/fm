import { type Config } from "@jest/types";

const config: Config.InitialOptions = {
  displayName: "fm-api-e2e",
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testRegex: ".*\\.e2e.spec\\.ts$",
  testTimeout: 9999999,
  collectCoverage: false,
};

export default config;
