import js from "@eslint/js";
import tselint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierConfig from "./prettier.mjs";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import turboPlugin from "eslint-plugin-turbo";
import importPlugin from "eslint-plugin-import";

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
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        allowDefaultProject: true,
      },
    },
  },
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "test/**/*.ts", "e2e/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.spec.json", // Relative path is better
        tsconfigRootDir: process.cwd(), // Let ESLint resolve from the current working directory
        projectService: false, // Explicitly disable project service for test files
      },
    },
    rules: {
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
    },
  },
  {
    plugins: {
      turbo: turboPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
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
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-duplicates": "error",
    },
  }
);
