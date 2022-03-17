import { readdir, rm } from "fs/promises";
import { resolvePath, getFileName } from "@foxkit/node-util/path";
import { join } from "path";

import { info } from "../log.mjs";

export async function cleanupSVGComponentFiles(components) {
  const relPath = "src/components/icons/"; // NOTE: change when moving client src
  const path = resolvePath(relPath);
  const dir = await readdir(path);
  const files = dir.filter(file => {
    const componentName = getFileName(file, false);
    return !(componentName === "index" || components.has(componentName));
  });

  if (files.length > 0) {
    await Promise.all(
      files.map(async file => {
        info(
          `Removing ${getFileName(file)} as source file was removed`,
          relPath
        );
        await rm(join(path, file));
      })
    );
  }
}
