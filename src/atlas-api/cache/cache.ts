import { msToSeconds } from "~/time/msToSeconds";
import { Log } from "~/utils/log";
import * as BasicCommandCode from "./data/basicCommandCode";
import * as BasicCraftEssence from "./data/basicCraftEssence";
import * as BasicMysticCode from "./data/basicMysticCode";
import * as BasicServant from "./data/basicServant";
import * as NiceItem from "./data/niceItem";
import * as NiceMasterMission from "./data/niceMasterMission";
import * as NiceServant from "./data/niceServant";
import * as NiceWar from "./data/niceWar";
import { getApiInfo, getCacheInfo } from "./info";
import type { ApiCacheInfo } from "./info";

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
  return lastChecked + 3600 > now;
}

export async function checkCacheUpdates(): Promise<ApiCacheUpdateInfo> {
  const now = msToSeconds(Date.now());
  // TODO: document this behaviour:
  const updateForced = Boolean(process.env.FORCE_ATLAS_CACHE_UPDATE);

  const localInfo = await getCacheInfo();
  // TODO: rm -rf cache dir if version missmatches?
  const localVersionMatches = localInfo?.version == CACHE_VER;

  if (updateForced) {
    Log.warn(
      "AtlasAcademy API Cache update was forced via environment variable"
    );
  } else if (!localInfo) {
    Log.warn("No AtlasAcademy API Cache was found");
  } else if (!localVersionMatches) {
    Log.warn("AtlasAcademy API Cache version missmatch");
  }

  if (updateForced || !localInfo || !localVersionMatches) {
    const apiInfo = await getApiInfo();

    return {
      JP: true,
      NA: true,
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

// WIP
async function prepareCache() {
  const shouldUpdate = await checkCacheUpdates();
  const updatedAny = shouldUpdate.NA || shouldUpdate.JP;

  if (shouldUpdate.JP) {
    Log.info("Updating AtlasAcademy Cache for JP");
    //...
  }

  if (updatedAny) {
    // write info
  }

  return shouldUpdate.info;
}
