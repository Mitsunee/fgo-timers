import fs from "fs/promises";

import { resolveFilePath } from "./path-helper.mjs";

export async function readFile(path) {
  const realpath = resolveFilePath(path);
  return await fs.readFile(realpath, "utf8");
}

export async function readFileJson(path) {
  const content = await fs.readFile(path);
  try {
    return JSON.parse(content);
  } catch (e) {
    return content;
  }
}

export async function writeFile(path, data, pretty) {
  const realpath = resolveFilePath(path);
  const content =
    typeof data !== "string"
      ? pretty
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data)
      : data;
  await fs.writeFile(realpath, content, "utf8");
}
