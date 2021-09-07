import { join } from "path";
import { readdir } from "fs/promises";

export async function getFileList(dirPath) {
  const fullPath = join(process.cwd(), dirPath);
  const fileList = await readdir(fullPath);
  const fileListJoined = fileList.map(ticketFile => join(fullPath, ticketFile));

  return fileListJoined;
}
