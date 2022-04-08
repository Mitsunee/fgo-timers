import { join } from "path";
import { readdir } from "fs/promises";
import { writeFile } from "@foxkit/node-util/fs";
import { resolvePath } from "@foxkit/node-util/path";

import { isEventFile } from "../utils/data-assets/isDataFile.mjs";
import { parseEventFile } from "../utils/data-assets/parseEventFile.mjs";
import { sortEvents } from "../utils/data-assets/sortEvents.mjs";
import { ready } from "../utils/log.mjs";

export async function bundleEvents() {
  const path = resolvePath("assets/data/events/");
  const dir = await readdir(path);
  const files = dir.map(file => join(path, file));
  const data = await Promise.all(files.filter(isEventFile).map(parseEventFile));
  const dataSorted = sortEvents(data);

  await writeFile("assets/static/events.json", dataSorted);

  ready("Built events bundle", "assets/static/events.json");
  return true;
}
