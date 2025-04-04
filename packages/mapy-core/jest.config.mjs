import baseConfig from "@repo/config-jest/base"

/** @type {import('jest').Config} */
export default {
    ...baseConfig,
    rootDir: ".",
    roots: ["<rootDir>/src", "<rootDir>/test"],
    coverageDirectory: "../../coverage/packages/fm-db",
    transform: {
      '^.+\\.ts?$': [
        'ts-jest',
        {
          tsconfig: 'tsconfig.spec.json'
        }
      ]
    }
}