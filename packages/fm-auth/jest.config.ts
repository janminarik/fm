import { type Config } from "@jest/types";

const config: Config.InitialOptions = {
  displayName: "test-fm-api",
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  roots: ["<rootDir>/src"],
  testRegex: ".*\\.spec\\.ts$|.*\\.test\\.ts$",
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
};

export default config;
