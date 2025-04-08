import baseConfig from "@repo/config-jest/base";

const config = {
  ...baseConfig,
  displayName: "fm-api",
  rootDir: ".",
  roots: ["<rootDir>/src", "<rootDir>/e2e"],
  testRegex: ".*\\.spec\\.ts$|.*\\.test\\.ts$",
  coverageDirectory: "../../coverage/app/fm-api",
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
