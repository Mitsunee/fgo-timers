import fs from "fs/promises";
import { dirname } from "path";
import { resolveFilePath } from "./path-helper.mjs";

export async function dirExists(filePath) {
  const fullPath = resolveFilePath(filePath);
  try {
    const dirStat = await fs.stat(fullPath);
    return dirStat.isDirectory();
  } catch {
    return false;
  }
}

export async function fileExists(filePath) {
  const fullPath = resolveFilePath(filePath);
  try {
    const fileStat = await fs.stat(fullPath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

export async function makeDir(dirPath) {
  await fs.mkdir(resolveFilePath(dirPath), { recursive: true });
}

export async function writeFile(filePath, content) {
  if (content === undefined || content === null) return false;

  // prep directory
  const dirPath = dirname(filePath);
  if (!(await dirExists(dirPath))) {
    await makeDir(dirPath);
  }

  // write File
  const fullPath = resolveFilePath(filePath);
  if (typeof content === "object") {
    // write objects as stringified json
    await fs.writeFile(fullPath, JSON.stringify(content), "utf8");
    return;
  }

  await fs.writeFile(fullPath, `${content}`, "utf8");
}

export async function readFile(filePath) {
  // check that file exists
  if (!fileExists(filePath)) {
    return false;
  }

  // read file
  try {
    return await fs.readFile(resolveFilePath(filePath), "utf8");
  } catch {
    return false;
  }
}

export async function readFileJson(filePath) {
  try {
    const fileContent = await readFile(filePath);
    if (!fileContent) return false;
    return JSON.parse(fileContent);
  } catch {
    return false;
  }
}
