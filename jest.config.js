const { createDefaultPreset, pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require('./tsconfig.json');

// const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  globalSetup: "<rootDir>/jest.setup.js",
  testMatch: [
    "<rootDir>/tests/**/*.test.ts"
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>'}),
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest", {
        diagnostics: {
          ignoreCodes: [151001, 151002]
        }
      }
    ]
  },
};