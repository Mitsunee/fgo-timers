import { readdir } from "fs/promises";
import { Command, Option } from "commander";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import type { z } from "zod";
import { basename, join } from "path";
import { Log } from "../utils/log";
import { EventSchema } from "./EventSchema";
import { ShopSchema } from "./ShopSchema";
import { CustomItemSchema } from "./CustomItem";
import { AvailabilityMapSchema } from "./AvailabilityMap";
import { QuestOpenOverridesSchema } from "./QuestOpenOverrides";

const program = new Command();
program
  .option("-A, --all", "Check all Data Files")
  .addOption(
    new Option("-e, --events", "Check all Event files").conflicts("all")
  )
  .addOption(new Option("-s, --shops").conflicts("all"))
  .addOption(
    new Option("-i, --items", "Check all Custom Item files").conflicts("all")
  )
  .addOption(
    new Option("-m, --maps", "Check all Availability Map Files").conflicts(
      "all"
    )
  )
  .addOption(
    new Option("-q, --quest-open", "Check Quest Open Time Override File")
  )
  .option("-S, --silent", "Run without logging to cli (except errors)");

interface ProgramOptions {
  all?: boolean;
  events?: boolean;
  shops?: boolean;
  items?: boolean;
  maps?: boolean;
  questOpen?: boolean;
  silent?: boolean;
}

const assetsPath = join(process.cwd(), "assets/data");

async function main(options: ProgramOptions) {
  const checkState = {
    checked: 0,
    failed: 0,
    passed: 0,
    skipped: 0
  };
  const { all, silent } = options;
  const startedAt = Date.now();
  const showGroupInfo = !silent && !all;

  async function checkFile(
    filePath: string,
    fileType: string,
    schema: z.ZodTypeAny
  ) {
    checkState.checked++;
    const fileContent = await readFileYaml<z.input<typeof schema>>(filePath);

    // handle unreadable file
    if (!fileContent) {
      Log.error(
        `Could not read ${fileType} file '${basename(filePath)}'. Skipping...`
      );
      checkState.skipped++;
      return;
    }

    const fileParsed = schema.safeParse(fileContent);
    if (fileParsed.success) {
      checkState.passed++;
      return;
    }

    // handle schema error
    Log.zodError(fileParsed.error, filePath);
    checkState.failed++;
    return;
  }

  function createProcessor(
    dirPath: string,
    fileType: string,
    schema: z.ZodTypeAny
  ) {
    return async function processor(fileName: string) {
      const filePath = join(dirPath, fileName);
      return checkFile(filePath, fileType, schema);
    };
  }

  // handle --all
  if (!silent && all) Log.info("Checking all data files");

  // handle --events
  if (all || options.events) {
    if (showGroupInfo) Log.info("Checking all event data files");
    const dirPath = join(assetsPath, "events");
    const files = await readdir(dirPath);
    const processor = createProcessor(dirPath, "event", EventSchema);

    for (const fileName of files) {
      if (!fileName.endsWith(".yml")) continue;
      await processor(fileName);
    }
  }

  // handle --shops
  if (all || options.shops) {
    if (showGroupInfo) Log.info("Checking all shop data files");
    const dirPath = join(assetsPath, "shops");
    const files = await readdir(dirPath);
    const processor = createProcessor(dirPath, "shop", ShopSchema);

    for (const fileName of files) {
      if (!fileName.endsWith(".yml")) continue;
      await processor(fileName);
    }
  }

  // handle --items
  if (all || options.items) {
    if (showGroupInfo) Log.info("Checking all custom item data files");
    const dirPath = join(assetsPath, "items");
    const files = await readdir(dirPath);
    const processor = createProcessor(dirPath, "custom item", CustomItemSchema);

    for (const fileName of files) {
      if (!fileName.endsWith(".yml")) continue;
      await processor(fileName);
    }
  }

  // handle --maps
  if (all || options.maps) {
    if (showGroupInfo) Log.info("Checking all availability map files");
    const files = [
      join(assetsPath, "ces/availability.yml"),
      join(assetsPath, "servants/availability.yml")
    ];

    for (const filePath of files) {
      await checkFile(filePath, "availability map", AvailabilityMapSchema);
    }
  }

  // handle --quest-open
  if (all || options.questOpen) {
    if (showGroupInfo) Log.info("Checking quest open time map file");
    const filePath = join(assetsPath, "upgrades/openTimeOverrides.yml");
    await checkFile(filePath, "quest open time map", QuestOpenOverridesSchema);
  }

  // die if no files were checked
  if (!checkState.checked) {
    Log.error(
      "No option was selected, please select any filetype(s) or use --all"
    );
    program.help({ error: true });
    process.exit(1);
  }

  const endedAt = Date.now();
  const timeTaken = `${(endedAt - startedAt) / 1000}s`;

  // print output
  if (!silent) {
    console.log(
      // prettier-ignore
      `\n  Total:     ${checkState.checked
      }\n  Passed:    ${checkState.passed
      }\n  Failed:    ${checkState.failed
      }\n  Skipped:   ${checkState.skipped
      }\n  Duration:  ${timeTaken
      }\n`
    );
  }

  process.exit(checkState.checked == checkState.passed ? 0 : 1);
}

// run program
program.parse();
main(program.opts());
