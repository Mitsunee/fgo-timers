const picocolors = require("picocolors");

const plugins = [
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
        "nesting-rules": true,
        "custom-media-queries": {
          importFrom: "src/client/styles/media.css"
        }
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
