import { writeFile } from "@foxkit/node-util/fs";
import { join } from "path";
import { Log } from "../utils/log.js";
import { cachePath, atlasCacheNA, atlasCacheJP } from "./cache";
import { getCacheStatus } from "./validation";

export async function prepareCache() {
  const { newInfo, updateNa, updateJp } = await getCacheStatus();
  const update = updateNa || updateJp;

  if (update) {
    Log.info("Updating AtlasAcademy API Cache");
  }

  if (updateNa) {
    await atlasCacheNA.updateCache();
    Log.ready("Updated AtlasAcademy API NA Export Cache");
  }

  if (updateJp) {
    await atlasCacheJP.updateCache();
    Log.ready("Updated AtlasAcademy API JP Export Cache");
  }

  // update local info
  if (update) {
    await writeFile(join(cachePath, "info.json"), newInfo);
    Log.info("Updated AtlasAcademy API Cache Info");
  }
}
