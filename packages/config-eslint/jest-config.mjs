import baseConfig from "./base.mjs";

export default [
  ...baseConfig,
  {
    files: ["**/jest.config.*", "**/*.jest.config.*"],
    rules: {
      // Allow importing dev dependencies in test config files
      "import/no-extraneous-dependencies": "off",
      // Jest configs often need dynamic requires
      "@typescript-eslint/no-var-requires": "off",
      // Config files often use @type comments
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
];
