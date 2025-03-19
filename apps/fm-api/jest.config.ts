import { type Config } from "@jest/types";

const config: Config.InitialOptions = {
  displayName: "fm-api",

  preset: "ts-jest",
  testEnvironment: "node",

  rootDir: ".",
  roots: ["<rootDir>/src", "<rootDir>/e2e"],
  testRegex: ".*\\.spec\\.ts$|.*\\.e2e.spec\\.ts$",

  coverageDirectory: "../../coverage/app/fm-api",

  collectCoverage: true,
  collectCoverageFrom: ["**/*.{ts,tsx}"],
};

export default config;
