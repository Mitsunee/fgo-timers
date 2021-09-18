import { join } from "path";
import { readdir } from "fs/promises";

import { resolveFilePath } from "@utils/server/resolveFilePath";

export async function getFileList(dirPath) {
  const fullPath = resolveFilePath(dirPath);
  const fileList = await readdir(fullPath);
  const fileListJoined = fileList.map(ticketFile => join(fullPath, ticketFile));

  return fileListJoined;
}
