/* getFileList
 * Reads list of files in a directory and returns as array of absolute paths
 */

import { join } from "path";
import { readdir } from "fs/promises";
import { resolvePath } from "@foxkit/node-util/path";
import { log } from "@foxkit/node-util/log";

export async function getFileList(dirPath) {
  const fullPath = resolvePath(dirPath);

  try {
    const fileList = await readdir(fullPath);
    const fileListJoined = fileList.map(filePath => join(fullPath, filePath));

    return fileListJoined;
  } catch (e) {
    log.error(`Couldn't read directory ${dirPath}`);
    throw e;
  }
}
