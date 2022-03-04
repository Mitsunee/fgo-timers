import { program } from "commander";
import { readdir } from "fs/promises";
import { resolvePath, joinPath } from "@foxkit/node-util/path";
import { fileExists } from "@foxkit/node-util/fs";

import {
  isEventFile,
  isTicketFile,
  isShopFile,
  isDataFile
} from "../utils/data-assets/isDataFile.mjs";
import { warn } from "../utils/log.mjs";

program.version("0.0.1");
program.option("-a, --all", "Check all Data Files");
program.option("-e, --events", "Check all Event files");
program.option("-t, --tickets", "Check all Login Ticket files");
program.option("-s, --shops", "Check all Prism Shop files");
program.option("-f, --file <files...>", "Parse only specific file(s)");

async function main(options) {
  const targets = new Set();

  if (options.all || options.events) {
    const path = resolvePath("assets/data/events/");
    const dir = await readdir(path);
    for (const file of dir) {
      const filePath = joinPath(path, file);
      if (!isEventFile(filePath)) continue;
      targets.add(filePath);
    }
  }

  if (options.all || options.tickets) {
    const path = resolvePath("assets/data/login-tickets/");
    const dir = await readdir(path);
    for (const file of dir) {
      const filePath = joinPath(path, file);
      if (!isTicketFile(filePath)) continue;
      targets.add(filePath);
    }
  }

  if (options.all || options.shops) {
    const path = resolvePath("assets/data/");
    const dir = await readdir(path);
    for (const file of dir) {
      const filePath = joinPath(path, file);
      if (!isShopFile(filePath)) continue;
      targets.add(filePath);
    }
  }

  if (options.file?.length > 0) {
    for (const file of options.file) {
      const filePath = resolvePath(file);
      console.log(filePath);
      const exists = await fileExists(filePath);

      if (!exists) {
        warn("File does not exist", filePath);
        continue;
      }
      if (!isDataFile(filePath)) {
        warn("File is not a recognized data file", filePath);
        continue;
      }

      targets.add(filePath);
    }
  }

  // TODO: actually check files
}

// run program
program.parse();
main(program.opts());
