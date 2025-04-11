import baseConfig from "@repo/config-jest/base";

const config = {
  ...baseConfig,
  displayName: "fm-auth",
  rootDir: ".",
  roots: ["<rootDir>/src"],
  testRegex: ".*\\.spec\\.ts$|.*\\.test\\.ts$",
  coverageDirectory: "../../coverage/app/fm-api",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.spec.ts",
    "!<rootDir>/src/**/*.test.ts",
  ],
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.spec.json",
      },
    ],
  },
};

export default config;
