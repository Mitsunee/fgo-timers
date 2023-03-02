module.exports = {
  parserOptions: { sourceType: "module" },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "foxkit",
    "foxkit/react",
    "foxkit/ts",
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
    }
  ]
};
