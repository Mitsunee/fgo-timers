import { readFileJson, writeFile } from "@foxkit/node-util/fs";
import { atlasApi, SupportedRegion } from "./api";
import { Region } from "@atlasacademy/api-connector";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Item } from "@atlasacademy/api-connector/dist/Schema/Item";
import type { MasterMission } from "@atlasacademy/api-connector/dist/Schema/MasterMission";

export const cachePath = ".next/cache/atlasacademy";
export const cacheVersion = "0.0.1"; // NOTE: bump when adding new things to cache

export async function readFromCache(
  region: "NA" | "JP",
  file: "nice_servant.json"
): Promise<Servant[]>;
export async function readFromCache(
  region: "NA" | "JP",
  file: "nice_item.json"
): Promise<Item[]>;
export async function readFromCache(
  region: "NA",
  file: "nice_master_mission.json"
): Promise<MasterMission[]>;
export async function readFromCache(
  region: SupportedRegion | string,
  file: string
): Promise<unknown> {
  return readFileJson(`${cachePath}/${region}/${file}`);
}

export async function updateCache(region: SupportedRegion) {
  const api = atlasApi[region];

  const [servantData, itemData] = await Promise.all([
    api.servantListNice(),
    api.itemList()
  ]);

  await Promise.all([
    writeFile(`${cachePath}/${region}/nice_servant.json`, servantData),
    writeFile(`${cachePath}/${region}/nice_item.json`, itemData)
  ]);

  if (region === Region.NA) {
    const masterMissionData = await api.masterMissionList();
    await writeFile(
      `${cachePath}/${Region.NA}/nice_master_mission.json`,
      masterMissionData
    );
  }
}
