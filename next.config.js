const transpiledModules = ["nanostores", "@nanostores/persistent"];
const withTM = require("next-transpile-modules")(transpiledModules); // pass the modules you would like to see transpiled

module.exports = withTM({
  reactStrictMode: true
});
