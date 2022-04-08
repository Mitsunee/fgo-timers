import { readdir } from "fs/promises";
import { resolvePath, getFileName } from "@foxkit/node-util/path";
import { join } from "path";

export async function findDeprecatedComponents(components) {
  const relPath = "src/client/components/icons/";
  const path = resolvePath(relPath);
  const dir = await readdir(path);
  const files = dir
    .filter(file => {
      const componentName = getFileName(file, false);
      return !(componentName === "index" || components.has(componentName));
    })
    .map(file => join(path, file));

  return files;
}
