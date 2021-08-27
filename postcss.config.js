const chalk = require("chalk");
const theme = require("./styles/theme");

const plugins = [
  "postcss-nested",
  ["postcss-theme-ui", theme],
  "postcss-focus"
];

if (process.env.NODE_ENV === "production") {
  plugins.push([
    "postcss-preset-env",
    {
      autoprefixer: {
        flexbox: "no-2009"
      },
      stage: 3,
      features: {
        "custom-properties": false
      }
    }
  ]);
}

console.log(
  `${chalk.cyan("info")}  - Using PostCSS Plugins: ${plugins
    .map(plugin => {
      if (plugin instanceof Array) return plugin[0];
      return plugin;
    })
    .join(", ")}`
);

module.exports = {
  plugins
};
