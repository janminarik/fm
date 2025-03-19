import { type Config } from "@jest/types";

const config: Config.InitialOptions = {
  displayName: "fm-api",
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  roots: ["<rootDir>/src", "<rootDir>/e2e"],
  testRegex: ".*\\.spec\\.ts$|.*\\.e2e.spec\\.ts$",
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../../coverage/app/fm-api",
};

export default config;
