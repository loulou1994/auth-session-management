const { createDefaultPreset, pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require('./tsconfig.json');

// const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./src/tests/"],
  testMatch: [
    "<rootDir>/src/tests/**/*.test.ts"
  ],
  moduleFileExtensions: ["ts", "js", "node", "json"],
  modulePaths: [compilerOptions.baseUrl],
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
  maxWorkers: 1
};