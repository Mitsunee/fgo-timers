import { getFileList } from "../utils/getFileList";
import { getFileName } from "@foxkit/node-util/path";

export async function generateBackgroundList() {
  const files = await getFileList("public/assets/backgrounds/landing");
  const names = files.map(file => getFileName(file));

  return names;
}
