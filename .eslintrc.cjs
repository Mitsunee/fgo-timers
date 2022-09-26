const restrictedGlobals = require("confusing-browser-globals");

module.exports = {
  parserOptions: { sourceType: "module" },
  extends: [
    "eslint:recommended",
    "foxkit",
    "foxkit/react",
    "foxkit/ts",
    "next",
    "prettier"
  ],
  rules: {
    "no-restricted-globals": ["error"].concat(restrictedGlobals),
    "@next/next/no-img-element": "off"
  },
  overrides: [
    {
      files: ["tests/server/**/*.test.js", "tests/client/**/*.test.js?(x)"],
      env: { jest: true }
    }
  ]
};
