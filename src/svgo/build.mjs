import { dirExists } from "@foxkit/node-util/fs";
import { resolvePath, toRelativePath } from "@foxkit/node-util/path";
import { join } from "path";
import { rm, readdir } from "fs/promises";

import { getComponentName } from "./getComponentName.mjs";
import { buildSVGComponent } from "./buildComponent.mjs";
import { buildSVGComponentIndex } from "./buildComponentIndex.mjs";
import { ready, error } from "../scripts/utils/log.mjs"; // TODO: move script utils somewhere else

const componentsPath = "src/client/components/icons/";

(async function main(flags) {
  if ((await dirExists(componentsPath)) && !flags.includes("--force")) {
    process.exit(0);
  }

  const path = resolvePath("assets/svg/");
  const dir = await readdir(path);
  const components = new Set();
  const files = dir
    .filter(file => file.endsWith(".svg") && !file.endsWith("inkscape.svg"))
    .map(file => {
      const filePath = join(path, file);
      const componentName = getComponentName(filePath);
      components.add(componentName);
      return { filePath, componentName };
    });

  // check for naming conflicts
  if (components.size < files.length) {
    // find naming conflict
    const conflictMap = new Map();

    // map conflicts
    for (const { filePath, componentName } of files) {
      if (conflictMap.has(componentName)) {
        conflictMap.get(componentName).push(filePath);
      } else {
        conflictMap.set(componentName, [filePath]);
      }
    }

    for (const [componentName, files] of conflictMap.entries()) {
      if (files.length < 2) continue;
      const file1 = toRelativePath(files[0]);
      const file2 = toRelativePath(files[1]);
      error(
        `Name conflict between '${file1}' and '${file2}' for name '${componentName}'`
      );
    }

    return false;
  }

  try {
    await rm(resolvePath(componentsPath), {
      recursive: true,
      force: true
    });
    await Promise.all(
      files.map(file => buildSVGComponent(file.filePath, file.componentName))
    );
    await buildSVGComponentIndex(Array.from(components));

    ready("Built SVG Icon Components", componentsPath);
    process.exit(0);
  } catch (e) {
    error(e);
    process.exit(1);
  }
})(process.argv.slice(2));
