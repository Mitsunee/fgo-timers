import { join } from "path";
import { readdir } from "fs/promises";
import { writeFile } from "@foxkit/node-util/fs";
import { resolvePath } from "@foxkit/node-util/path";

import { isEventFile } from "../utils/data-assets/isDataFile.mjs";
import { parseEventFile } from "../utils/data-assets/parseEventFile.mjs";
import { ready } from "../utils/log.mjs";

export async function bundleEvents() {
  const start = Date.now();
  const path = resolvePath("assets/data/events/");
  const dir = await readdir(path);
  const files = dir.map(file => join(path, file));
  const data = await Promise.all(files.filter(isEventFile).map(parseEventFile));
  const dataSorted = data.sort((a, b) => {
    if (a.start === b.start) {
      return a.order - b.order;
    }

    return b.start - a.start;
  });

  await writeFile("assets/static/events.json", dataSorted);
  const duration = Date.now() - start;
  ready(`Built events bundle (in ${duration}ms)`, "assets/static/events.json");
}
