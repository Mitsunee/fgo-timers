const { rules } = require("@foxkit/eslint-config/rules");
const restrictedGlobals = require("confusing-browser-globals");

module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: false
    }
  },
  extends: ["prettier", "eslint:recommended", "next"],
  rules: {
    ...rules,
    "no-restricted-globals": ["error"].concat(restrictedGlobals),
    "@next/next/no-img-element": "off",
    "react/jsx-filename-extension": ["error", { extensions: [".jsx"] }],
    "no-undef": ["error"]
  },
  overrides: [
    {
      files: ["*.jsx"],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    {
      files: ["*.mjs"]
    }
  ]
};
