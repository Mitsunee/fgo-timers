import { join } from "path";
import { readdir } from "fs/promises";
import { resolvePath } from "@foxkit/node-util/path";

export async function getFileList(dirPath) {
  const fullPath = resolvePath(dirPath);
  const fileList = await readdir(fullPath);
  const fileListJoined = fileList.map(filePath => join(fullPath, filePath));

  return fileListJoined;
}
