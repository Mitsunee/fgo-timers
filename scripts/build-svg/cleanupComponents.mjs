import { basename, extname } from "path";
import { rm } from "fs/promises";
import { createSpinner } from "nanospinner";
import { globby } from "globby";

import { die } from "../shared/log.mjs";

export async function cleanupComponents(components) {
  const spinner = createSpinner("Cleaning up ./src/components/icons/");
  const dir = await globby("src/components/icons/*.jsx");
  const dirUnknown = dir.filter(
    file => !components.includes(basename(file, extname(file)))
  );
  for (const file of dirUnknown) {
    const name = basename(file);
    try {
      await rm(file);
    } catch (e) {
      spinner.error();
      die(`Could not delete '${name}'. No source file exists for this path.`);
      return;
    }

    spinner.success({ text: "Cleaned up ./src/components/icons/" });
  }
}
