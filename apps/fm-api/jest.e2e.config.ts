import { type Config } from "@jest/types";
// import { baseJestPreset } from "@repo/config-jest/nest.mjs";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  displayName: "fm-api-e2e",
  // preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testRegex: ".*\\.e2e.spec\\.ts$",
  testTimeout: 9999999,
  collectCoverage: false,
};

export default config;
