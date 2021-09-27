/* eslint-disable no-unused-vars */
import { optimize, loadConfig } from "svgo";
import { convertSvgToJsx } from "@svgo/jsx";
import { globby } from "globby";
import fs from "fs/promises";
import prettier from "prettier";
import path from "path";
import { red, yellow, cyan } from "nanocolors";

async function main() {
  // globals
  const configSvgo = await loadConfig();
  const configSvgoJsx = {
    svgProps: {
      "{...props}": null
    },
    plugins: [
      ...configSvgo.plugins,
      // removes xmlns namespace unnecessary when svg is inlined into html
      { name: "removeXMLNS" },
      // prevents collision with other components on the page
      { name: "prefixIds" }
    ]
  };
  const configPrettier = {
    parser: "babel",
    ...(await prettier.resolveConfig(process.cwd()))
  };

  // load
  const svgFiles = await globby("assets/svg/!(*inkscape).svg");
  const components = new Array();

  for (const file of svgFiles) {
    const componentName = `Icon-${path.basename(file, path.extname(file))}`
      .replace(/^[a-z]/, c => c.toUpperCase())
      .replace(/[_-][a-z]/g, c => c.substring(1).toUpperCase())
      .replace(/[^a-z]/gi, "");

    // check for naming conflicts
    const conflictCheck = components.find(({ name }) => name === componentName);
    if (conflictCheck) {
      throw new Error(
        `Name conflict between '${conflictCheck.file}' and '${file}' for name '${componentName}'`
      );
    }

    // commit name to list
    components.push({ file: path.basename(file), name: componentName });

    // build component
    const fileContent = await fs.readFile(file, "utf8");
    const { data: svg } = await optimize(fileContent, configSvgo);
    const component = `export default function ${componentName}(props) {
      return ${await convertSvgToJsx({ svg, ...configSvgoJsx })}
    }`;
    const componentPretty = await prettier.format(component, configPrettier);

    // check if svgo did anything, save changes and warn user
    if (fileContent !== svg) {
      await fs.writeFile(file, svg, "utf8");
      console.log(
        yellow(`Warning: '${path.basename(file)}' was not optimized.`)
      );
    }

    // write component
    await fs.writeFile(
      `src/components/icons/${componentName}.jsx`,
      componentPretty,
      "utf8"
    );
    console.log(
      cyan(`Built component '${componentName}' for '${path.basename(file)}'.`)
    );
  }

  // rewrite index.js
  const componentNames = components.map(component => component.name);
  await fs.writeFile(
    "src/components/icons/index.js",
    await prettier.format(
      `${componentNames
        .map(name => `import ${name} from "./${name}"`)
        .join("\n")}\n\nexport {${componentNames.join(",")}}`,
      configPrettier
    ),
    "utf8"
  );
  console.log(cyan("Built 'icons/index.js'"));
}

main().catch(e => {
  console.error(red(e));
  process.exit(1);
});
