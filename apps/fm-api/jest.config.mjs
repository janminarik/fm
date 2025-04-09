import baseConfig from "@repo/config-jest/base";

const config = {
  ...baseConfig,
  displayName: "fm-api",
  rootDir: ".",
  roots: ["<rootDir>/src", "<rootDir>/e2e"],
  testRegex: ".*\\.spec\\.ts$|.*\\.test\\.ts$",
  coverageDirectory: "../../coverage/app/fm-api",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.spec.ts",
    "!<rootDir>/src/**/*.test.ts",
    "!<rootDir>/src/**/*.module.ts",
    "!<rootDir>/src/main.ts",
    "!<rootDir>/src/utils/test/*.ts",
    "!<rootDir>/swagger.ts",
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
