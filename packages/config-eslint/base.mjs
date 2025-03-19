import js from "@eslint/js";
import tselint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierConfig from "./prettier.mjs";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import turboPlugin from "eslint-plugin-turbo";

export default tselint.config(
  {
    ignores: [
      "eslint.config.mjs",
      "dist/**",
      ".*.?(c|m)js",
      "*.setup*.?(c|m)js",
      "*.config*.?(c|m)js",
      "*.d.ts",
      ".turbo/",
      ".git/",
      "build/",
      "dist/",
      "coverage/",
      "node_modules/",
    ],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...tselint.configs.recommendedTypeChecked,
  {
    plugins: {
      turbo: turboPlugin,
      prettier: prettierPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "prettier/prettier": ["error", prettierConfig],
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
);
