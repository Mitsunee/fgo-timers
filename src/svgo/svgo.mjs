import { convertSvgToJsx } from "@svgo/jsx";
import { loadConfig, optimize } from "svgo";

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

export async function svgo(fileContent) {
  config ??= await getConfig();
  try {
    const optimized = optimize(fileContent, config.svgo);
    return optimized.data;
  } catch (e) {
    console.error(e.name == "SvgoParserError" ? e.toString() : e);
    process.exit(1);
  }
}

export async function svgToJsx(svg) {
  config ??= await getConfig();
  const { jsx } = await convertSvgToJsx({ svg, ...config.jsx });
  return jsx;
}
