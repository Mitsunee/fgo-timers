import { readdir } from "fs/promises";
import { writeFile } from "@foxkit/node-util/fs";
import { resolvePath, getFileName } from "@foxkit/node-util/path";

import { ready } from "../utils/log.mjs";

export async function bundleBackgrounds() {
  const start = Date.now();
  const path = resolvePath("public/assets/backgrounds/landing/");
  const dir = await readdir(path);
  const files = dir
    .map(file => getFileName(file))
    .filter(file => file.endsWith(".jpg") || file.endsWith(".png"));

  await writeFile("assets/static/backgrounds.json", files);
  const duration = Date.now() - start;
  ready(
    `Built backgrounds bundle (in ${duration}ms)`,
    "assets/static/backgrounds.json"
  );
}
