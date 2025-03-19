import baseConfig from "@repo/config-jest/nest.mjs";

const config  = {
  ...baseConfig,
  //!nastavuje preset na ts-jest, čo umožňuje spúšťať TypeScript testy priamo bez nutnosti kompilácie do JavaScriptu
  preset: "ts-jest",
  displayName: "fm-auth",
  testEnvironment: "node",

  rootDir: ".",
  roots: ["<rootDir>/src"],
  
  testRegex: ".*\\.spec\\.ts$|.*\\.test\\.ts$",
  
  collectCoverageFrom: ["**/*.{ts,tsx}"],
  coverageDirectory: "../../coverage/packages/fm-auth",
};

export default config;
