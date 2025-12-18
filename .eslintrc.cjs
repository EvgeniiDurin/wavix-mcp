/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@wavix/eslint-config-node"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: "./tsconfig.eslint.json"
  },
  plugins: ["jest"],
  rules: {
    "no-console": "off",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/member-ordering": "off",
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
