import baseConfig from "@repo/config-jest/base";

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  displayName: "fm-api-e2e",
  rootDir: ".",
  roots: ["<rootDir>/e2e"],
  testRegex: ".*\\.e2e.spec\\.ts$",
  coverageDirectory: "../../coverage/app/fm-api-e2e",
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
