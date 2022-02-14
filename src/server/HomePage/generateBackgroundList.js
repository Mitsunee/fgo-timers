import { getFileName } from "@foxkit/node-util/path";

import { withStaticBundle } from "../utils/withStaticBundle";
import { getFileList } from "../utils/getFileList";

export async function generateBackgroundList() {
  async function fallback() {
    const files = await getFileList("public/assets/backgrounds/landing");
    const names = files.map(file => getFileName(file));

    return names;
  }

  return await withStaticBundle("HomePage_backgrounds", fallback);
}
