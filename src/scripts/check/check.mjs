import { program } from "commander";
import { readdir } from "fs/promises";
import { resolvePath, joinPath } from "@foxkit/node-util/path";
import { fileExists } from "@foxkit/node-util/fs";

import { prepareAtlasCache } from "../utils/atlasacademy/prepareCache.mjs";
import {
  isEventFile,
  isTicketFile,
  isShopFile,
  isDataFile
} from "../utils/data-assets/isDataFile.mjs";
import * as log from "../utils/log.mjs";
import { checkDataFile } from "../utils/data-assets/checkDataFile.mjs";

program.version("0.0.1");
program.option("-a, --all", "Check all Data Files");
program.option("-e, --events", "Check all Event files");
program.option("-t, --tickets", "Check all Login Ticket files");
program.option("-s, --shops", "Check all Prism Shop files");
program.option("-f, --file <files...>", "Parse only specific file(s)");
program.option("-S, --silent", "Run without logging to cli");

async function main(options) {
  // update cache
  await prepareAtlasCache();

  const targets = new Set();
  const startedAt = Date.now();
  const silent = options.silent;
  const showGroupInfo = !silent && !options.all;
  let skipped = 0;
  let passed = 0;

  // handle --all
  if (!silent && options.all) log.info("Checking all data files");

  // handle --events
  if (options.all || options.events) {
    if (showGroupInfo) log.info("Checking all event data files");
    const path = resolvePath("assets/data/events/");
    const dir = await readdir(path);
    for (const file of dir) {
      const filePath = joinPath(path, file);
      if (!isEventFile(filePath)) continue;
      targets.add(filePath);
    }
  }

  // handle --tickets
  if (options.all || options.tickets) {
    if (showGroupInfo) log.info("Checking all login ticket data files");
    const path = resolvePath("assets/data/login-tickets/");
    const dir = await readdir(path);
    for (const file of dir) {
      const filePath = joinPath(path, file);
      if (!isTicketFile(filePath)) continue;
      targets.add(filePath);
    }
  }

  // handle --shops
  if (options.all || options.shops) {
    if (showGroupInfo) log.info("Checking all prism shop data files");
    const path = resolvePath("assets/data/");
    const dir = await readdir(path);
    for (const file of dir) {
      const filePath = joinPath(path, file);
      if (!isShopFile(filePath)) continue;
      targets.add(filePath);
    }
  }

  // handle --file
  if (options.file?.length > 0) {
    for (const file of options.file) {
      const filePath = resolvePath(file);
      const exists = await fileExists(filePath);

      if (!exists) {
        if (!silent) log.error("File does not exist", filePath);
        skipped++;
        continue;
      }
      if (!isDataFile(filePath)) {
        if (!silent) log.error("File is not a recognized data file", filePath);
        skipped++;
        continue;
      }

      targets.add(filePath);
    }
  }

  // die if no files selected
  if (targets.size < 1) {
    if (!silent) {
      log.error("No valid data file paths found");
      program.help({ error: true });
    }
    process.exit(1);
  }

  // run checks
  const total = targets.size;
  for (const file of targets) {
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

// TODO: nano-staged patterns
