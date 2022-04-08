import { loadConfig, optimize } from "svgo";
import { convertSvgToJsx } from "@svgo/jsx";

const configPromise = loadConfig();
let configCache;

async function getConfig() {
  if (configCache) return configCache;

  const config = new Object();
  config.svgo = await configPromise;
  config.jsx = {
    svgProps: {
      "{...props}": null
    },
    plugins: [
      ...config.svgo.plugins,
      // removes xmlns namespace unnecessary when svg is inlined into html
      { name: "removeXMLNS" },
      // prevents collision with other components on the page
      { name: "prefixIds" }
    ]
  };
  configCache = config;
  return config;
}

export async function svgo(fileContent) {
  const config = await getConfig();
  const { data } = await optimize(fileContent, config.svgo);
  return data;
}

export async function svgToJsx(svg) {
  const config = await getConfig();
  const { jsx } = await convertSvgToJsx({ svg, ...config.jsx });
  return jsx;
}
