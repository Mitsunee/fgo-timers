/* eslint-disable no-unused-vars */
import { optimize, loadConfig } from "svgo";
import { convertSvgToJsx } from "@svgo/jsx";
import { globby } from "globby";
import { rm } from "fs/promises";
import path from "path";
import picocolors from "picocolors";
import { createSpinner } from "nanospinner";

import { buildComponents } from "./build-svg/buildComponents.mjs";
import { log, die } from "./shared/log.mjs";
import { readFile, writeFile } from "./shared/fs-helper.mjs";
import { format } from "./shared/format.mjs";

async function main() {
  // globals
  const configSvgo = await loadConfig();

  // build components
  const svgFiles = await globby("assets/svg/!(*inkscape).svg");
  const componentNames = await buildComponents(svgFiles, configSvgo);

  // rewrite index.js
  await writeFile(
    "src/components/icons/index.js",
    format(`
      ${componentNames
        .map(name => `import ${name} from "./${name}"`)
        .join("\n")}

      export {${componentNames.join(",")}}
    `)
  );
  log.success("Built 'icons/index.js'");

  // cleanup components dir
  const dir = await globby("src/components/icons/*.jsx");
  const dirUnknown = dir.filter(
    file => !componentNames.includes(path.basename(file, path.extname(file)))
  );
  for (const file of dirUnknown) {
    const name = path.basename(file);
    try {
      await rm(file);
      log.warn(`Cleaned up '${name}' as source file does not exist anymore.`);
    } catch (e) {
      log.error(
        `Could not delete '${name}'. No source file exists for this path.`
      );
    }
  }
}

main().catch(e => die(e));
