import reactBaseConfig from "@repo/config-eslint/react-internal.mjs";

export default [
  ...reactBaseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
];
