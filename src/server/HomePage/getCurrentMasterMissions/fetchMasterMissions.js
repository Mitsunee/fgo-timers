import { atlasApiNA } from "~/atlas-api/api.ts";
import { getNiceMasterMission } from "~/atlas-api/cache/data/niceMasterMission.ts";
import { getCacheInfo } from "~/atlas-api/cache/info.ts";
import { spacetimeToTs, tsToSpacetime } from "~/server/utils/time";
import { Log } from "~/utils/log";

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
  const cacheInfo = await getCacheInfo();
  if (!cacheInfo) Log.throw(`Could not read cache info`);
  const cacheMaxAge = getNextDay(cacheInfo.lastChecked);
  let masterMissions = await getNiceMasterMission("NA");

  // depending on if the cache is from today use cache or API to fetch missions data
  if (now >= cacheMaxAge) {
    try {
      Log.info("Fetching Master Missions from API");
      masterMissions = await atlasApiNA.masterMissionList();
    } catch {
      Log.warn("Could not reach Atlas Academy API");
    }
  }

  return splitMissionsByType(masterMissions);
}
