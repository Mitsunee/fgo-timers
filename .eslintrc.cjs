module.exports = {
  parserOptions: { sourceType: "module" },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "foxkit",
    "foxkit/react",
    "foxkit/ts-strict",
    "next",
    "prettier"
  ],
  rules: { "@next/next/no-img-element": "off" },
  overrides: [
    {
      files: ["tests/server/**/*.test.js", "tests/client/**/*.test.js?(x)"],
      env: { jest: true }
    },
    {
      files: ["**/*.ts?(x)"],
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname
      },
      rules: {
        "no-undef": "off",
        "no-redeclare": "off",
        "dot-notation": "off",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/consistent-type-exports": [
          "warn",
          { fixMixedExportsWithInlineTypeSpecifier: false }
        ],
        "@typescript-eslint/consistent-type-imports": ["error"],
        "@typescript-eslint/consistent-generic-constructors": "warn",
        "@typescript-eslint/no-misused-promises": "warn",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
        "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "warn",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/dot-notation": "warn"
      }
    },
    {
      files: ["**/*.mjs", "**/*.js?(x)", "**/*.ts?(x)"],
      plugins: ["simple-import-sort"],
      extends: ["plugin:import/recommended", "plugin:import/typescript"],
      rules: {
        "sort-imports": "off",
        "simple-import-sort/imports": [
          "warn",
          {
            groups: [
              [
                // Side effect imports.
                "^\\u0000"
              ],
              [
                // node built-ins
                `^(${require("module").builtinModules.join("|")})(/|$)`,
                // external packages (types last)
                "^react",
                "^@?\\w",
                "\\w\\u0000",
                // internal packages
                "^src",
                "^@(components|server|stores|styles|utils)\\/",
                "^~",
                "^src\\/.*\\u0000$",
                "^@(components|server|stores|styles|utils)\\/.*\u0000$",
                "^~\\/.*\\u0000$",
                // Parent imports. Put `..` last.
                "^\\.\\.\\/",
                "^\\.\\.\\/.*\u0000$",
                // Same-folder imports and `.` last.
                "^\\.\\/",
                "^\\.\\/.*\u0000$",
                // Style imports.
                "^.+\\.s?css$"
              ]
            ]
          }
        ],
        "import/order": "off",
        "import/first": "warn",
        "import/newline-after-import": "warn"
      }
    }
  ]
};
