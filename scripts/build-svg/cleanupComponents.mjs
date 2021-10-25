import { basename, extname } from "path";
import { rm } from "fs/promises";
import { createSpinner } from "nanospinner";
import { globby } from "globby";

import { log } from "../shared/log.mjs";

export async function cleanupComponents(componentNames) {
  const spinner = createSpinner("Cleaning up ./src/components/icons/");
  const dir = await globby("src/components/icons/*.jsx");
  const dirUnknown = dir.filter(
    file => !componentNames.includes(basename(file, extname(file)))
  );
  for (const file of dirUnknown) {
    const name = basename(file);
    try {
      await rm(file);
    } catch (e) {
      log.error(
        `Could not delete '${name}'. No source file exists for this path.`,
        spinner
      );
      return;
    }

    log.success("Cleaned up ./src/components/icons/", spinner);
  }
}
