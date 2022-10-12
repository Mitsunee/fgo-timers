import { readdir } from "fs/promises";
import { writeFile } from "@foxkit/node-util/fs";
import { resolvePath, getFileName } from "@foxkit/node-util/path";

import { Log } from "../utils/log";

const dirPath = resolvePath("public/assets/backgrounds/landing/");
const bundlePath = "assets/static/backgrounds.json";

export async function bundleBackgrounds() {
  const dir = await readdir(dirPath);
  const files = dir
    .map(file => getFileName(file))
    .filter(file => file.endsWith(".jpg") || file.endsWith(".png"));

  await writeFile(bundlePath, files);
  Log.ready(`Built backgrounds bundle ${Log.styleParent(bundlePath)}`);
  return true;
}
