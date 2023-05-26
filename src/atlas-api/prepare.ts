import { join } from "path";
import { writeFile } from "@foxkit/node-util/fs";
import { Log } from "../utils/log";
import { atlasCacheJP, atlasCacheNA, cachePath } from "./cache";
import { getCacheStatus } from "./validation";

/**
 * Method to check/update local api cache. Run at start of scripts!
 * @returns AtlasCacheInfo
 */
export async function prepareCache() {
  const { newInfo, updateNa, updateJp } = await getCacheStatus();
  const update = updateNa || updateJp;
  if (!update) return newInfo;
  Log.info("Updating AtlasAcademy API Cache");

  if (updateNa) {
    await atlasCacheNA.updateCache();
    Log.ready("Updated AtlasAcademy API NA Export Cache");
  }

  if (updateJp) {
    await atlasCacheJP.updateCache();
    Log.ready("Updated AtlasAcademy API JP Export Cache");
  }

  // update local info
  await writeFile(join(cachePath, "info.json"), newInfo);
  Log.info("Updated AtlasAcademy API Cache Info");

  return newInfo;
}
