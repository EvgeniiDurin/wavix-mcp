/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: false
          },
          target: "es2022"
        },
        module: {
          type: "es6"
        }
      }
    ]
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@root/(.*)$": "<rootDir>/src/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^@tools/(.*)$": "<rootDir>/src/tools/$1",
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@resources/(.*)$": "<rootDir>/src/resources/$1"
  },
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/build/", "/agents/"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["html", "text", "text-summary", "lcov", "cobertura"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.test.ts",
    "!src/**/*.spec.ts",
    "!src/api/types.ts",
    "!src/tools/generated/**"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 60000,
  maxWorkers: "100%",
  verbose: true,
  forceExit: true
}
