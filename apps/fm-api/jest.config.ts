import { type Config } from "@jest/types";
import { config as baseJestPreset } from "@repo/config-jest/nest.js";

const config: Config.InitialOptions = {
  // preset: "ts-jest",

  ...baseJestPreset,
  displayName: "fm-api",
  testEnvironment: "node",

  rootDir: ".",
  roots: ["<rootDir>/src", "<rootDir>/e2e"],
  testRegex: ".*\\.spec\\.ts$|.*\\.e2e.spec\\.ts$",

  coverageDirectory: "../../coverage/app/fm-api",

  collectCoverage: true,
  collectCoverageFrom: ["**/*.{ts,tsx}"],
};

export default config;
