const picocolors = require("picocolors");

const plugins = [
  ["@csstools/postcss-global-data", { files: ["src/client/styles/media.css"] }],
  ["postcss-focus", { oldFocus: true }],
  [
    "postcss-preset-env",
    {
      autoprefixer: { flexbox: "no-2009" },
      stage: 2,
      features: {
        "custom-properties": false,
        "nesting-rules": true,
        "custom-media-queries": true
      }
    }
  ]
];

console.log(
  `- ${picocolors.cyan("info")} Using PostCSS Plugins: ${plugins
    .map(plugin => {
      if (plugin instanceof Array) return plugin[0];
      return plugin;
    })
    .join(", ")}`
);

module.exports = {
  plugins
};
