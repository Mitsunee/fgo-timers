import { Region } from "@atlasacademy/api-connector";
import { writeFile } from "@foxkit/node-util/fs";

import * as log from "../log.mjs";
import { cachePath, updateCache } from "./cache";
import { getCacheStatus } from "./cache-validation";

export async function prepareAtlasCache() {
  const { newInfo, updateNa, updateJp } = await getCacheStatus();

  if (updateNa) {
    await updateCache(Region.NA);
    log.ready("Updated AtlasAcademy API NA Export Cache");
  }

  if (updateJp) {
    await updateCache(Region.JP);
    log.ready("Updated AtlasAcademy API JP Export Cache");
  }

  // update local info
  if (updateNa || updateJp) {
    await writeFile(`${cachePath}/info.json`, newInfo);
    log.info("Updated AtlasAcademy API Cache Info");
  }
}
