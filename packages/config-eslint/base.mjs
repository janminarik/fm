import js from "@eslint/js";
import tselint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierConfig from "./prettier.mjs";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import turboPlugin from "eslint-plugin-turbo";
import importPlugin from "eslint-plugin-import";
import jestPlugin from "eslint-plugin-jest";

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
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        projectService: true,
        allowDefaultProject: true,
      },
    },
  },
  {
    files: [
      "**/*.spec.ts",
      "**/*.test.ts",
      "**/*.spec.tsx",
      "**/*.test.tsx",
      "test/**/*.ts",
      "e2e/**/*.ts",
    ],
    languageOptions: {
      globals: jestPlugin.environments.globals.globals,
      parserOptions: {
        project: "./tsconfig.spec.json",
        tsconfigRootDir: process.cwd(),
        projectService: false,
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      ...jestPlugin.configs.style.rules,

      // "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
      "jest/expect-expect": "error",
      "jest/no-conditional-expect": "error",
      "jest/no-mocks-import": "error",
      "jest/consistent-test-it": [
        "error",
        { fn: "test", withinDescribe: "test" },
      ],
      "jest/no-standalone-expect": "error",
      "jest/no-duplicate-hooks": "error",
      "@typescript-eslint/unbound-method": "off",
      "jest/unbound-method": "error",
    },
  },

  {
    plugins: {
      turbo: turboPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
      jest: jestPlugin,
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
