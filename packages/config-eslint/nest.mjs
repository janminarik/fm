import baseConfig from "./base.mjs";

export default [
  ...baseConfig,
  {
    rules: {
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unsafe-argument": "warn",

      // Keep this off for NestJS patterns which often require type assertions
      "@typescript-eslint/no-unsafe-assignment": "off",

      // Common NestJS patterns often need explicit any in decorators and DI
      "@typescript-eslint/no-explicit-any": "warn",

      // Prevent promise-related bugs
      "@typescript-eslint/await-thenable": "error",

      // Strongly typed exception handling
      // "@typescript-eslint/no-throw-literal": "error",
    },
  },
];
