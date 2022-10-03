import { readFileJson } from "@foxkit/node-util/fs";

import { getCurrentTime } from "../scripts/utils/getCurrentTime.mjs";
import * as log from "../scripts/utils/log.mjs";
import { atlasCache, cachePath, cacheVersion } from "./cache";

async function fetchApiInfo() {
  const [NA, JP] = await Promise.all([
    atlasCache.NA.getInfo(),
    atlasCache.JP.getInfo()
  ]);
  return { NA, JP };
}

export async function getLocalCacheInfo(): Promise<AtlasCacheInfo | null> {
  const infoLocal = await readFileJson<AtlasCacheInfo>(
    `${cachePath}/info.json`
  );
  if (!infoLocal) return null;
  return infoLocal;
}

export async function getCacheStatus(): Promise<{
  newInfo: AtlasCacheInfo;
  updateNa?: boolean;
  updateJp?: boolean;
}> {
  const now = getCurrentTime();
  const infoLocal = await getLocalCacheInfo();
  const cacheVersionMatch = infoLocal?.version === cacheVersion;

  // log if no cache or version missmatch
  if (!infoLocal) {
    log.info("No local API cache found");
  } else if (!cacheVersionMatch) {
    log.info("API Cache version missmatch");
  }

  // skip if cache version matches and last check was within the past hour
  if (infoLocal && cacheVersionMatch && infoLocal.lastChecked + 3600 > now) {
    log.info("Skipped API Cache update");
    return { newInfo: infoLocal }; //{ info: infoLocal };
  }

  const info = await fetchApiInfo();
  const updateNa = !infoLocal || !cacheVersionMatch || infoLocal.NA < info.NA;
  const updateJp = !infoLocal || !cacheVersionMatch || infoLocal.JP < info.JP;

  return {
    newInfo: { ...info, version: cacheVersion, lastChecked: now },
    updateNa,
    updateJp
  };
}
