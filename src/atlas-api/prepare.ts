import { writeFile } from "@foxkit/node-util/fs";
import { join } from "path";
import * as log from "../scripts/utils/log.mjs";
import { cachePath, atlasCacheNA, atlasCacheJP } from "./cache";
import { getCacheStatus } from "./validation";

export async function prepareCache() {
  const { newInfo, updateNa, updateJp } = await getCacheStatus();

  if (updateNa) {
    await atlasCacheNA.updateCache();
    log.ready("Updated AtlasAcademy API NA Export Cache");
  }

  if (updateJp) {
    await atlasCacheJP.updateCache();
    log.ready("Updated AtlasAcademy API JP Export Cache");
  }

  // update local info
  if (updateNa || updateJp) {
    await writeFile(join(cachePath, "info.json"), newInfo);
    log.info("Updated AtlasAcademy API Cache Info");
  }
}
