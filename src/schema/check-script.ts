import { basename, join } from "path";
import { getFileName, readDir } from "@foxkit/node-util/fs";
import { ParsedFile } from "@foxkit/node-util/fs-extra";
import { Command, Option } from "commander";
import YAML from "yaml";
import type { ZodSchema } from "zod";
import { Log } from "~/utils/log";
import { AvailabilityMapSchema } from "./AvailabilityMap";
import { CustomItemSchema } from "./CustomItem";
import { EventSchema } from "./EventSchema";
import { QuestOpenOverridesSchema } from "./QuestOpenOverrides";
import { ShopSchema } from "./ShopSchema";

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

const Yaml = new ParsedFile<unknown>({
  limitPath: assetsPath,
  parse: file => YAML.parse(file),
  extensions: [".yml"]
});

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

  function duplicateFileNameCheck(files: string[]) {
    const knownNames = new Set<string>();
    const duplicates = new Set<string>();

    // search for duplicates
    for (const filePath of files) {
      const fileName = getFileName(filePath);
      if (!knownNames.has(fileName)) {
        knownNames.add(fileName);
        continue;
      }
      duplicates.add(fileName);
    }

    // return passed array if no duplicates were found
    if (duplicates.size < 1) return files;

    // Log duplicated paths
    for (const duplicateName of duplicates) {
      const duplicatePaths = files.filter(
        file => getFileName(file) == duplicateName
      );

      Log.error(
        `Duplicate event file name: '${duplicateName}'\n${JSON.stringify(
          duplicatePaths,
          null,
          2
        )}`
      );

      checkState.checked += duplicatePaths.length;
      checkState.failed += duplicatePaths.length;
    }

    // return filtered list
    return files.filter(file => !duplicates.has(getFileName(file)));
  }

  async function checkFile(
    filePath: string,
    fileType: string,
    schema: ZodSchema
  ) {
    checkState.checked++;
    const res = await Yaml.readFile(filePath);

    // handle unreadable file
    if (!res.success) {
      Log.error(
        `Could not read ${fileType} file '${basename(filePath)}'. Skipping...`
      );
      Log.error(res.error);
      checkState.skipped++;
      return;
    }

    const fileParsed = schema.safeParse(res.data);
    if (fileParsed.success) {
      checkState.passed++;
      return;
    }

    // handle schema error
    Log.zodError(fileParsed.error, filePath);
    checkState.failed++;
    return;
  }

  // handle --all
  if (!silent && all) Log.info("Checking all data files");

  // handle --events
  if (all || options.events) {
    if (showGroupInfo) Log.info("Checking all event data files");
    const dirPath = join(assetsPath, "events");
    const files = await readDir(dirPath, {
      recursive: true,
      pathStyle: "absolute"
    });
    const filesDeduped = duplicateFileNameCheck(files);
    await Promise.all(
      filesDeduped.map(file => checkFile(file, "event", EventSchema))
    );
  }

  // handle --shops
  if (all || options.shops) {
    if (showGroupInfo) Log.info("Checking all shop data files");
    const dirPath = join(assetsPath, "shops");
    const files = await readDir(dirPath, { pathStyle: "absolute" });
    await Promise.all(files.map(file => checkFile(file, "shop", ShopSchema)));
  }

  // handle --items
  if (all || options.items) {
    if (showGroupInfo) Log.info("Checking all custom item data files");
    const dirPath = join(assetsPath, "items");
    const files = await readDir(dirPath, { pathStyle: "absolute" });
    await Promise.all(
      files.map(file => checkFile(file, "custom item", CustomItemSchema))
    );
  }

  // handle --maps
  if (all || options.maps) {
    if (showGroupInfo) Log.info("Checking all availability map files");
    const dirPath = join(assetsPath, "availability");
    const files = await readDir(dirPath, { pathStyle: "absolute" });
    await Promise.all(
      files.map(file =>
        checkFile(file, "availability map", AvailabilityMapSchema)
      )
    );
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
