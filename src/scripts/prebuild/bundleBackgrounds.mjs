import { readdir } from "fs/promises";
import { writeFile } from "@foxkit/node-util/fs";
import { resolvePath, getFileName } from "@foxkit/node-util/path";

import { ready } from "../utils/log.mjs";

export async function bundleBackgrounds() {
  const path = resolvePath("public/assets/backgrounds/landing/");
  const dir = await readdir(path);
  const files = dir
    .map(file => getFileName(file))
    .filter(file => file.endsWith(".jpg") || file.endsWith(".png"));

  await writeFile("assets/static/backgrounds.json", files);
  ready("Built backgrounds bundle", "assets/static/backgrounds.json");
}
