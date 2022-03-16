import { writeFile } from "@foxkit/node-util/fs";

import * as log from "../log.mjs";
import { cachePath, cacheTargets, updateCacheFile } from "./cache.mjs";
import { getCacheStatus } from "./cache-validation.mjs";

export async function prepareAtlasCache() {
  const { newInfo, updateNa, updateJp } = await getCacheStatus();

  if (updateNa) {
    await Promise.all(cacheTargets.NA.map(file => updateCacheFile("NA", file)));
    log.ready("Updated AtlasAcademy API NA Export Cache");
  }

  if (updateJp) {
    await Promise.all(cacheTargets.JP.map(file => updateCacheFile("JP", file)));
    log.ready("Updated AtlasAcademy API JP Export Cache");
  }

  // update local info
  if (updateNa || updateJp) {
    await writeFile(`${cachePath}/info.json`, newInfo);
  }
}
