import { loadConfig, optimize } from "svgo";
import { convertSvgToJsx } from "@svgo/jsx";

let config;
async function getConfig() {
  const svgoConfig = await loadConfig();
  if (!svgoConfig) throw new Error("Could not find svgo config file");
  const config = {
    svgo: svgoConfig,
    jsx: {
      svgProps: {
        "{...props}": null
      },
      plugins: [
        ...(svgoConfig.plugins || []),
        // removes xmlns namespace unnecessary when svg is inlined into html
        { name: "removeXMLNS" },
        // prevents collision with other components on the page
        { name: "prefixIds" }
      ]
    }
  };
  return config;
}

function isOptimizedSvg(optimized) {
  return !optimized.error;
}

export async function svgo(fileContent) {
  config ??= await getConfig();
  const optimized = optimize(fileContent, config.svgo);
  if (!isOptimizedSvg(optimized)) {
    throw new Error(`Failed to optimize SVG: ${optimized.error}`);
  }
  return optimized.data;
}

export async function svgToJsx(svg) {
  config ??= await getConfig();
  const { jsx } = await convertSvgToJsx({ svg, ...config.jsx });
  return jsx;
}
