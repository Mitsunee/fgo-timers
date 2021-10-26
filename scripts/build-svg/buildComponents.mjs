import { loadConfig, optimize } from "svgo";
import { convertSvgToJsx } from "@svgo/jsx";
import { createSpinner } from "nanospinner";

import { basename, extname } from "path";
import { readFile, writeFile } from "../shared/fs-helper.mjs";
import { log, die } from "../shared/log.mjs";
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
    const componentName = `Icon-${basename(file, extname(file))}`
      .replace(/^[a-z]/, c => c.toUpperCase())
      .replace(/[_-][a-z]/g, c => c.substring(1).toUpperCase())
      .replace(/[^a-z]/gi, "");
    const spinner = createSpinner(`Building ${componentName}`);

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
    spinner.start();
    components.push(componentName);
    fileNames.set(componentName, file);
    const fileContent = await readFile(file);
    const { data: svg } = await optimize(fileContent, config);

    // write component
    await writeFile(
      `src/components/icons/${componentName}.jsx`,
      format(`
        export default function ${componentName}(props) {
          return ${await convertSvgToJsx({ svg, ...configSvgoJsx })}
        }
      `)
    );

    spinner.success({
      text: `Built '${componentName}' for '${basename(file)}'.`
    });

    // check if svgo did anything, save changes and warn user
    if (fileContent !== svg) {
      await writeFile(file, svg);
      log.warn(`  '${basename(file)}' was not optimized.`);
    }
  }

  return components;
}
