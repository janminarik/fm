import baseConfig from "@repo/config-jest/nest.mjs";

const config  = {
  ...baseConfig,
  displayName: "test-fm-auth",
  testEnvironment: "node",
  rootDir: ".",
  roots: ["<rootDir>/src"],
  testRegex: ".*\\.spec\\.ts$|.*\\.test\\.ts$",
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../../coverage/packages/fm-auth",
};

export default config;
