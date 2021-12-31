import { loadConfig, optimize } from "svgo";
import { convertSvgToJsx } from "@svgo/jsx";
import { createSpinner } from "nanospinner";
import { log, die } from "@foxkit/node-util/log";
import { readFile, writeFile } from "@foxkit/node-util/fs";
import { getFileName } from "@foxkit/node-util/path";

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

  for (const file of svgFiles) {
    const componentName = `Icon-${getFileName(file, false)}`
      .replace(/^[a-z]/, c => c.toUpperCase())
      .replace(/[_-][a-z]/g, c => c.substring(1).toUpperCase())
      .replace(/[^a-z]/gi, "");
    const spinner = createSpinner(`Building ${componentName}`).start();

    // check for naming conflicts
    if (fileNames.has(componentName)) {
      spinner.error();
      die(
        `Name conflict between '${fileNames.get(
          componentName
        )}' and '${file}' for name '${componentName}'`
      );
    }

    // build component
    components.push(componentName);
    fileNames.set(componentName, file);
    const fileContent = await readFile(file);
    const { data: svg } = await optimize(fileContent, config);

    // check if svgo did anything, save changes and warn user
    if (fileContent !== svg) {
      await writeFile(file, svg);
      spinner.clear();
      log.warn(`  '${getFileName(file)}' was not optimized.`);
      spinner.start();
    }

    const { jsx } = await convertSvgToJsx({ svg, ...configSvgoJsx });

    // write component
    await writeFile(
      `src/components/icons/${componentName}.jsx`,
      format(`
        export default function ${componentName}(props) {
          return ${jsx}
        }
      `)
    );

    spinner.success({
      text: `Built '${componentName}' for '${getFileName(file)}'.`
    });
  }

  return components;
}
