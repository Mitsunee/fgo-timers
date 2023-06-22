import path from "path";
import type { MasterMission } from "@atlasacademy/api-connector/dist/Schema/MasterMission";
import { cachedJson } from "../cachedFile";
import type { PathsMap } from "../types";

export const paths = {
  NA: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/masterMission/nice_master_mission_na.json"
  )
} satisfies Partial<PathsMap>;

export const File = cachedJson<MasterMission[]>({ paths });

/**
 * Gets nice Master Mission export (NA-only)
 * @returns nice Master Mission export
 */
export async function getNiceMasterMission() {
  const res = await File.readFile(paths.NA);
  if (!res.success) throw res.error;
  return res.data;
}

// TODO: getNiceWeeklyMission maybe?
