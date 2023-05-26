import { readFileJson } from "@foxkit/node-util/fs";
import { msToSeconds } from "../time/msToSeconds";
import { Log } from "../utils/log";
import { atlasCache, cachePath, cacheVersion } from "./cache";

async function fetchApiInfo() {
  const [NA, JP] = await Promise.all([
    atlasCache.NA.getInfo(),
    atlasCache.JP.getInfo()
  ]);
  return { NA, JP };
}

export interface AtlasCacheInfo {
  NA: number;
  JP: number;
  version: string;
  lastChecked: number;
}

/**
 * Reads cache info of local api cache
 * @returns AtlasCacheInfo
 */
export async function getLocalCacheInfo(): Promise<AtlasCacheInfo | null> {
  const infoLocal = await readFileJson<AtlasCacheInfo>(
    `${cachePath}/info.json`
  );
  if (!infoLocal) return null;
  return infoLocal;
}

/**
 * Fetches API info and compares with local cache info to determine whether or not cache updates are needed.
 * @returns Object containing new local cache info after updates as "newInfo" and "updateNa"/"updateJp" prop (boolean) to tell which to update
 */
export async function getCacheStatus(): Promise<{
  newInfo: AtlasCacheInfo;
  updateNa?: boolean;
  updateJp?: boolean;
}> {
  const now = msToSeconds(Date.now());
  const infoLocal = await getLocalCacheInfo();
  const cacheVersionMatch = infoLocal?.version === cacheVersion;

  // log if no cache or version missmatch
  if (!infoLocal) {
    Log.info("No local API cache found");
  } else if (!cacheVersionMatch) {
    Log.info("API Cache version missmatch");
  }

  // skip if cache version matches and last check was within the past hour
  if (infoLocal && cacheVersionMatch && infoLocal.lastChecked + 3600 > now) {
    Log.info("Skipped API Cache update");
    return { newInfo: infoLocal };
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
