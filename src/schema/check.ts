import { Command, Option } from "commander";
import { readdir } from "fs/promises";
import { resolvePath, joinPath } from "@foxkit/node-util/path";
import { fileExists } from "@foxkit/node-util/fs";

import { prepareCache } from "../atlas-api/prepare";
import { isShopFile } from "../scripts/utils/data-assets/isDataFile.mjs";
import { checkDataFile } from "../scripts/utils/data-assets/checkDataFile.mjs";
import { Log } from "../utils/log";
import { EventAssetsDir } from "../pages/EventPage/constants";
import { checkCustomItemPath } from "./CustomItem";
import { checkEventPath } from "./EventSchema";

const program = new Command();
program
  .option("-a, --all", "Check all Data Files")
  .addOption(
    new Option("-e, --events", "Check all Event files").conflicts("all")
  )
  .addOption(
    new Option("-s, --shops", "Check all Prism Shop files").conflicts("all")
  )
  .addOption(
    new Option("-i, --items", "Check all Custom Item files").conflicts("all")
  )
  .addOption(
    new Option(
      "-f, --file <files...>",
      "Parse only specific file(s)"
    ).conflicts("all")
  )
  .option("-S, --silent", "Run without logging to cli");

interface ProgramOptions {
  all?: boolean;
  events?: boolean;
  shops?: boolean;
  items?: boolean;
  file?: string[];
  silent?: boolean;
}

async function main(options: ProgramOptions) {
  // update cache
  await prepareCache();

  const targets = new Set();
  const startedAt = Date.now();
  const silent = options.silent;
  const showGroupInfo = !silent && !options.all;
  let skipped = 0;
  let passed = 0;

  // handle --all
  if (!silent && options.all) Log.info("Checking all data files");

  // handle --events
  if (options.all || options.events) {
    if (showGroupInfo) Log.info("Checking all event data files");
    const path = resolvePath(EventAssetsDir);
    const dir = await readdir(path);
    for (const file of dir) {
      const filePath = joinPath(path, file);
      if (!checkEventPath(filePath)) continue;
      targets.add(filePath);
    }
  }

  // handle --shops
  if (options.all || options.shops) {
    if (showGroupInfo) Log.info("Checking all prism shop data files");
    const path = resolvePath("assets/data/");
    const dir = await readdir(path);
    for (const file of dir) {
      const filePath = joinPath(path, file);
      if (!isShopFile(filePath)) continue;
      targets.add(filePath);
    }
  }

  // handle --items
  if (options.all || options.items) {
    if (showGroupInfo) Log.info("Checking all custom item data files");
    const path = resolvePath("assets/data/items");
    const dir = await readdir(path);
    for (const file of dir) {
      const filePath = joinPath(path, file);
      if (!checkCustomItemPath(filePath)) continue;
      targets.add(filePath);
    }
  }

  // handle --file
  if (options.file && options.file?.length > 0) {
    for (const file of options.file) {
      const filePath = resolvePath(file);
      const exists = await fileExists(filePath);

      if (!exists) {
        if (!silent) Log.error("File does not exist", filePath);
        skipped++;
        continue;
      }

      // FIXME: doesn't consider new parsers
      /* if (!isDataFile(filePath)) {
        if (!silent) Log.error("File is not a recognized data file", filePath);
        skipped++;
        continue;
      } */

      targets.add(filePath);
    }
  }

  // die if no files selected
  if (targets.size < 1) {
    if (!silent) {
      Log.error("No valid data file paths found");
      program.help({ error: true });
    }
    process.exit(1);
  }

  // run checks
  const total = targets.size;
  for (const file of Array.from(targets)) {
    const result = await checkDataFile(file);
    if (result) passed++;
  }
  const endedAt = Date.now();
  const timeTaken = `${(endedAt - startedAt) / 1000}s`;

  // print output
  if (!silent) {
    console.log(
      `\n  Total:     ${total}\n  Passed:    ${passed}\n  Failed:    ${
        total - passed
      }\n  Skipped:   ${skipped}\n  Duration:  ${timeTaken}\n`
    );
  }

  if (skipped > 0 || passed < total) process.exit(1);
  process.exit(0);
}

// run program
program.parse();
main(program.opts());
