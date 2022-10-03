import { atlasCacheNA } from "@atlas-api/cache.ts";
import { getLocalCacheInfo } from "@atlas-api/validation.ts";
import { atlasApiNA } from "@atlas-api/api.ts";
import { tsToSpacetime, spacetimeToTs } from "@server/utils/time";
import { info } from "@server/utils/log";

function splitMissionsByType(masterMissions) {
  const weeklyMissions = masterMissions.filter(
    ({ missions }) => missions[0].type === "weekly"
  );
  const limitedMissions = masterMissions.filter(
    ({ missions }) => missions[0].type === "limited"
  );

  return { weeklyMissions, limitedMissions };
}

function getNextDay(now) {
  const s = tsToSpacetime(now, "etc/utc");
  return spacetimeToTs(s.next("day"));
}

export async function fetchMasterMissions(now) {
  const cacheInfo = await getLocalCacheInfo();
  const cacheMaxAge = getNextDay(cacheInfo.lastChecked);
  let masterMissions;

  // depending on if the cache is from today use cache or API to fetch missions data
  if (now < cacheMaxAge) {
    info("Reading Master Missions from local cache");
    masterMissions = await atlasCacheNA.getMasterMissions("NA");
  } else {
    info("Fetching Master Missions from API");
    masterMissions = await atlasApiNA.masterMissionList();
  }

  return splitMissionsByType(masterMissions);
}
