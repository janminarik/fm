/** @type {import('jest').Config} */
const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testRegex: ".*\\.spec\\.ts$|.*\\.test\\.ts$",
    collectCoverageFrom: ["**/*.ts"],
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "/dist/"
    ],
  };
  
  export default config;
  
  
  