module.exports = {
  parserOptions: { sourceType: "module" },
  extends: [
    "foxkit/strict",
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
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
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
                "^\\u0000",
                "^\\u0000.+\\.css$"
              ],
              [
                // node built-ins
                `^(${require("module").builtinModules.join("|")})(/|$)`,
                // external packages (types last)
                "^react",
                "^@?\\w",
                "\\w\\u0000",
                // internal packages
                "^~",
                "^~\\/.*\\u0000$",
                // Parent imports. Put `..` last.
                "^\\.\\.\\/",
                "^\\.\\.\\/.*\u0000$",
                // Same-folder imports and `.` last.
                "^\\.\\/",
                "^\\.\\/.*\u0000$",
                // Style imports.
                "^.+\\.module\\.css$"
              ]
            ]
          }
        ],
        "import/order": "off",
        "import/first": "warn",
        "import/newline-after-import": "warn",
        "import/no-unresolved": "off"
      }
    }
  ]
};
