import { rm } from "fs/promises";
import { createSpinner } from "nanospinner";
import { globby } from "globby";
import { die } from "@foxkit/node-util/log";
import { getFileName } from "@foxkit/node-util/path";

export async function cleanupComponents(components) {
  const spinner = createSpinner("Cleaning up ./src/components/icons/");
  const dir = await globby("src/components/icons/*.jsx");
  const dirUnknown = dir.filter(
    file => !components.includes(getFileName(file, false))
  );
  for (const file of dirUnknown) {
    const name = getFileName(file);
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
