import { readFileJson, writeFile } from "@foxkit/node-util/fs";
import { join } from "path";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Item } from "@atlasacademy/api-connector/dist/Schema/Item";
import type { MasterMission } from "@atlasacademy/api-connector/dist/Schema/MasterMission";
import { atlasApi } from "./api";

export const cachePath = ".next/cache/atlasacademy";
export const cacheVersion = "0.0.1b"; // NOTE: bump when adding new things to cache
enum cacheFile {
  SERVANT = "nice_servant.json",
  ITEM = "nice_item.json",
  MASTERMISSION = "nice_master_mission.json"
}

export async function getNiceServant(region: "NA" | "JP"): Promise<Servant[]> {
  const data = await readFileJson<Servant[]>(
    join(cachePath, region, cacheFile.SERVANT)
  );

  if (!data) {
    throw new Error(
      `Could not read ${cacheFile.SERVANT} from cache for region ${region}`
    );
  }

  return data;
}

export async function getNiceItem(region: "NA" | "JP"): Promise<Item[]> {
  const data = await readFileJson<Item[]>(
    join(cachePath, region, cacheFile.ITEM)
  );

  if (!data) {
    throw new Error(
      `Could not read ${cacheFile.ITEM} from cache for region ${region}`
    );
  }

  return data;
}

export async function getMasterMissions(
  region: "NA"
): Promise<MasterMission[]> {
  const data = await readFileJson<MasterMission[]>(
    join(cachePath, region, cacheFile.MASTERMISSION)
  );

  if (!data) {
    throw new Error(
      `Could not read ${cacheFile.MASTERMISSION} for region ${region}`
    );
  }

  return data;
}

export async function updateCache(region: "NA" | "JP") {
  const api = atlasApi[region];

  const [servantData, itemData] = await Promise.all([
    api.servantListNice(),
    api.itemList()
  ]);

  await Promise.all([
    writeFile(join(cachePath, region, cacheFile.SERVANT), servantData),
    writeFile(join(cachePath, region, cacheFile.ITEM), itemData)
  ]);

  if (region === "NA") {
    const masterMissionData = await api.masterMissionList();
    await writeFile(
      join(cachePath, region, cacheFile.MASTERMISSION),
      masterMissionData
    );
  }
}
