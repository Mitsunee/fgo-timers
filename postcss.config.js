const picocolors = require("picocolors");
const theme = require("./src/client/styles/theme");

const plugins = [
  ["postcss-theme-ui", theme],
  "postcss-focus",
  [
    "postcss-preset-env",
    {
      autoprefixer: {
        flexbox: "no-2009"
      },
      stage: 2,
      features: {
        "custom-properties": false,
        "nesting-rules": true
      }
    }
  ]
];

console.log(
  `${picocolors.cyan("info")}  - Using PostCSS Plugins: ${plugins
    .map(plugin => {
      if (plugin instanceof Array) return plugin[0];
      return plugin;
    })
    .join(", ")}`
);

module.exports = {
  plugins
};
