import { readdir } from "fs/promises";
import { resolvePath, toRelativePath } from "@foxkit/node-util/path";
import { join } from "path";

import { getComponentName } from "../utils/svg/getComponentName.mjs";
import { buildSVGComponent } from "../utils/svg/buildComponent.mjs";
import { buildSVGComponentIndex } from "../utils/svg/buildComponentIndex.mjs";
import { findDeprecatedComponents } from "../utils/svg/findDeprecatedComponents.mjs";
import { removeSvgComponent } from "../utils/svg/removeComponent.mjs";
import { ready, error } from "../utils/log.mjs";

export async function buildSVGComponents() {
  const path = resolvePath("assets/svg/");
  const dir = await readdir(path);
  const components = new Set();
  const files = dir
    .filter(file => file.endsWith(".svg") && !file.endsWith("inkscape.svg"))
    .map(file => {
      const filePath = join(path, file);
      const componentName = getComponentName(filePath);
      components.add(componentName);
      return { file: filePath, componentName };
    });

  // check for naming conflicts
  if (components.size < files.length) {
    // find naming conflict
    const conflictMap = new Map();

    // map conflicts
    for (const { file, componentName } of files) {
      if (conflictMap.has(componentName)) {
        conflictMap.get(componentName).push(file);
      } else {
        conflictMap.set(componentName, [file]);
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

  await Promise.all(files.map(buildSVGComponent));
  await buildSVGComponentIndex(components);
  const cleanup = await findDeprecatedComponents(components);

  if (cleanup.length > 0) {
    await Promise.all(cleanup.map(file => removeSvgComponent(file)));
  }

  ready("Built SVG Icon Components", "src/client/components/icons/");
  return true;
}
