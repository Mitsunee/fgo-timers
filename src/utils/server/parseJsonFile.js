import { readFile } from "fs/promises";

import { resolveFilePath } from "@utils/server/resolveFilePath";

export async function parseJsonFile(filePath) {
  const fullPath = resolveFilePath(filePath);
  const fileContent = await readFile(fullPath, "utf8");
  const data = JSON.parse(fileContent);

  return data;
}
