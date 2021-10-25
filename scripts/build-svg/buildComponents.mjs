import { loadConfig, optimize } from "svgo";
import { convertSvgToJsx } from "@svgo/jsx";
import { createSpinner } from "nanospinner";

import { basename, extname } from "path";
import { readFile, writeFile } from "../shared/fs-helper.mjs";
import { log } from "../shared/log.mjs";
import { format } from "../shared/format.mjs";

export async function buildComponents(svgFiles) {
  const config = await loadConfig();
  const configSvgoJsx = {
    svgProps: {
      "{...props}": null
    },
    plugins: [
      ...config.plugins,
      // removes xmlns namespace unnecessary when svg is inlined into html
      { name: "removeXMLNS" },
      // prevents collision with other components on the page
      { name: "prefixIds" }
    ]
  };

  const components = new Array();
  const fileNames = new Map();
  const spinner = createSpinner("Building Components");
  spinner.start();

  for (const file of svgFiles) {
    const componentName = `Icon-${basename(file, extname(file))}`
      .replace(/^[a-z]/, c => c.toUpperCase())
      .replace(/[_-][a-z]/g, c => c.substring(1).toUpperCase())
      .replace(/[^a-z]/gi, "");

    // check for naming conflicts
    if (fileNames.has(componentName)) {
      log.error(
        `Name conflict between '${fileNames.get(
          componentName
        )}' and '${file}' for name '${componentName}'`,
        spinner
      );
      process.exit(1);
    }

    // build component
    components.push(componentName);
    fileNames.set(componentName, file);
    const fileContent = await readFile(file);
    const { data: svg } = await optimize(fileContent, config);

    // check if svgo did anything, save changes and warn user
    if (fileContent !== svg) {
      await writeFile(file, svg);
      log.warn(`'${basename(file)}' was not optimized.`, spinner);
    }

    // write component
    await writeFile(
      `src/components/icons/${componentName}.jsx`,
      format(`
        export default function ${componentName}(props) {
          return ${await convertSvgToJsx({ svg, ...configSvgoJsx })}
        }
      `)
    );
  }

  log.success(
    `Built components: ${components
      .map(
        componentName =>
          `  - '${componentName}' for '${basename(
            fileNames.get(componentName)
          )}'.`
      )
      .join("\n")}`,
    spinner
  );

  return components;
}
