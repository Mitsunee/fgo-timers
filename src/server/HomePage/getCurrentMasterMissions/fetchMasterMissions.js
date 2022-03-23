import {
  atlasExport,
  readCacheInfo,
  readFromCache
} from "src/server/utils/atlasacademy";
import { tsToSpacetime, spacetimeToTs } from "src/server/utils/time";
import { info } from "src/server/utils/log";

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
  const cacheInfo = await readCacheInfo();
  const cacheMaxAge = getNextDay(cacheInfo.lastChecked);
  let masterMissions;

  // depending on if the cache is from today use cache or API to fetch missions data
  if (now < cacheMaxAge) {
    info("Reading Master Missions from local cache");
    masterMissions = await readFromCache("NA", "nice_master_mission.json");
  } else {
    info("Fetching Master Missions from API");
    masterMissions = await atlasExport.NA("nice_master_mission.json");
  }

  return splitMissionsByType(masterMissions);
}
