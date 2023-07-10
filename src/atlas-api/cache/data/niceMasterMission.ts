import path from "path";
import { CacheFile } from "../CacheFile";

export const paths = {
  NA: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/masterMission/nice_master_mission_na.json"
  )
};

export const NiceMasterMission = new CacheFile({
  name: "Nice Master Mission",
  fetcher: connector => connector.masterMissionList(),
  paths
});

/**
 * Gets nice Master Mission export (NA-only)
 * @returns nice Master Mission export
 */
export async function getNiceMasterMission(region: "NA" = "NA") {
  const res = await NiceMasterMission.readFile(paths[region]);
  if (!res.success) throw res.error;
  return res.data;
}

// TODO: getNiceWeeklyMission maybe?
