import baseConfig from "@repo/config-jest/base";

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  // preset: "ts-jest",
  displayName: "fm-api-e2e",
  // testEnvironment: "node",
  rootDir: ".",
  testRegex: ".*\\.e2e.spec\\.ts$",
  testTimeout: 9999999,
  collectCoverage: false,
};

export default config;
