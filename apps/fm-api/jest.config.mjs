import baseConfig from "@repo/config-jest/nest.mjs";

const config = {
  ...baseConfig,
  //!preset dat do base confogu node-jest.config.mjs
  preset: "ts-jest",
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
