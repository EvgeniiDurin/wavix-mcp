/** @type {import('eslint').Linter.Config} */
const path = require("path")

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: path.resolve(__dirname, "tsconfig.eslint.json")
  },
  plugins: ["jest", "@typescript-eslint", "import"],
  settings: {
    "import/resolver": {
      typescript: {
        project: path.resolve(__dirname, "tsconfig.eslint.json")
      }
    }
  },
  rules: {
    "no-console": "off",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "no-plusplus": "off",
    "import/order": "off"
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.spec.ts"],
      env: {
        jest: true,
        "jest/globals": true
      },
      extends: ["plugin:jest/recommended"],
      rules: {
        "jest/expect-expect": "warn",
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-conditional-expect": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/require-await": "off"
      }
    }
  ],
  ignorePatterns: [
    "node_modules",
    "build",
    "*.js",
    "src/api/types.ts",
    "src/tools/generated/**"
  ]
}
