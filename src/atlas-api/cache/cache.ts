import { rm } from "fs/promises";
import { resolve } from "path";
import { List } from "@foxkit/util/object";
import { msToSeconds } from "~/time/msToSeconds";
import { Log } from "~/utils/log";
import { Semaphore } from "~/utils/Semaphore";
import { atlasApi } from "../api";
import * as BasicCommandCode from "./data/basicCommandCode";
import * as BasicCraftEssence from "./data/basicCraftEssence";
import * as BasicMysticCode from "./data/basicMysticCode";
import * as BasicServant from "./data/basicServant";
import * as NiceItem from "./data/niceItem";
import * as NiceMasterMission from "./data/niceMasterMission";
import * as NiceServant from "./data/niceServant";
import * as NiceWar from "./data/niceWar";
import { getApiInfo, getCacheInfo, writeCacheInfo } from "./info";
import type { ApiCacheInfo } from "./info";
import type { CacheFile } from "./types";

export const CACHE_VER = "0.7.0"; // NOTE: bump when adding new things to cache

interface ApiCacheUpdateInfo {
  /**
   * Whether to update NA exports
   */
  NA: boolean;
  /**
   * Whether to update JP exports
   */
  JP: boolean;
  /**
   * new ApiCacheInfo to write after completed update
   */
  info: ApiCacheInfo;
  /**
   * Whether to delete the existing cache before updating
   */
  clean?: boolean;
}

/**
 * Compares cache age with current time. Updates are currently checked hourly,
 * so if the current local cache is less than an hour old the update should be
 * skipped. Set the environment variable `FORCE_ATLAS_CACHE_UPDATE` to any
 * non-empty value to force an update.
 *
 * @param now Current time
 * @param lastChecked Value from local cache info
 * @returns `true` if should update, false otherwise
 */
function compareCacheAge(now: number, lastChecked: number) {
  // updates are currently checked hourly
  return lastChecked + 3600 < now;
}

export async function checkCacheUpdates(): Promise<ApiCacheUpdateInfo> {
  const now = msToSeconds(Date.now());
  const updateForced = Boolean(process.env.FORCE_ATLAS_CACHE_UPDATE);
  const localInfo = await getCacheInfo();
  const localVersionMatches = localInfo?.version == CACHE_VER;

  if (updateForced) {
    Log.warn(
      "AtlasAcademy API Cache update was forced via environment variable"
    );
  } else if (!localInfo) {
    Log.warn("No AtlasAcademy API Cache Info file was found");
  } else if (!localVersionMatches) {
    Log.warn("AtlasAcademy API Cache version missmatch");
  }

  if (updateForced || !localInfo || !localVersionMatches) {
    const apiInfo = await getApiInfo();

    return {
      JP: true,
      NA: true,
      clean: true,
      info: {
        JP: apiInfo.JP.timestamp,
        NA: apiInfo.NA.timestamp,
        lastChecked: now,
        version: CACHE_VER
      }
    };
  }

  const shouldCheck = compareCacheAge(now, localInfo.lastChecked);

  if (!shouldCheck) {
    Log.info("Skipped AtlasAcademy API Cache update");
    return {
      JP: false,
      NA: false,
      info: localInfo
    };
  }

  const apiInfo = await getApiInfo();

  return {
    JP: localInfo.JP == apiInfo.JP.timestamp,
    NA: localInfo.NA == apiInfo.NA.timestamp,
    info: {
      JP: apiInfo.JP.timestamp,
      NA: apiInfo.NA.timestamp,
      lastChecked: now,
      version: CACHE_VER
    }
  };
}

/**
 * List object containing all exports
 */
const cacheFiles = new List<CacheFile<any>>();
cacheFiles
  .push(BasicCommandCode)
  .push(BasicCraftEssence)
  .push(BasicMysticCode)
  .push(BasicServant)
  .push(NiceItem)
  .push(NiceMasterMission)
  .push(NiceServant)
  .push(NiceWar);

async function updateCacheRegion(region: SupportedRegion) {
  Log.info(`Updating AtlasAcademy API Cache for ${region}`);

  async function processCacheFile<T extends CacheFile<any>>(file: T) {
    const filePath = file.paths[region];
    if (!filePath) {
      Log.info(
        `Skipping ${file.name} for region ${region} as no path was given`
      );
      return null;
    }

    const data = await file.Fetcher(atlasApi[region]);
    const res = await file.File.writeFile(filePath, data);
    if (!res.success) {
      Log.warn(`Error writing ${file.name} for region ${region}`);
      Log.error(res.error);
    }

    return res;
  }

  type Result = Awaited<ReturnType<typeof processCacheFile>>;
  const sem = new Semaphore<CacheFile<any>, Result>(processCacheFile, 3);
  const res = await sem.run(cacheFiles);

  if (res.some(result => result && !result.success)) {
    Log.throw(`Error writing Cache for region ${region}`);
  }
}

// TODO: doc comments
export async function prepareCache() {
  const shouldUpdate = await checkCacheUpdates();
  const updatedAny = shouldUpdate.NA || shouldUpdate.JP;

  if (shouldUpdate.clean) {
    Log.info(`Cleaning AtlasAcademy API Cache directory`);
    await rm(resolve(".next/cache/atlasacademy"), {
      recursive: true,
      force: true
    });
  }

  if (shouldUpdate.JP) await updateCacheRegion("JP");
  if (shouldUpdate.NA) await updateCacheRegion("NA");
  if (updatedAny) await writeCacheInfo(shouldUpdate.info);

  return shouldUpdate.info;
}
