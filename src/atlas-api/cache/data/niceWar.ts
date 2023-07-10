import path from "path";
import { CacheFile } from "../CacheFile";

export const paths = {
  JP: path.join(process.cwd(), ".next/cache/atlasacademy/war/nice_war_jp.json"),
  NA: path.join(process.cwd(), ".next/cache/atlasacademy/war/nice_war_na.json")
};

export const NiceWar = new CacheFile({
  name: "Nice War & Nice Quest",
  fetcher: connector => connector.warListNice(),
  paths
});
/**
 * Gets nice War export
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns nice War export
 */
export async function getNiceWarsFull(region: SupportedRegion = "JP") {
  const filePath = paths[region];
  const res = await NiceWar.readFile(filePath);
  if (!res.success) throw res.error;
  return res.data;
}

/**
 * Gets nice data of Wars by id
 * @param ids ids of Wars to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Array of Wars (may include undefined if any id was not found)
 */
export async function getNiceWars(
  ids: number[],
  region: SupportedRegion = "JP"
) {
  const niceWars = await getNiceWarsFull(region);
  return ids.map(id => niceWars.find(war => war.id == id));
}

/**
 * Gets nice data of War by id
 * @param id id of War to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns War or undefined if not found
 */
export async function getNiceWar(id: number, region: SupportedRegion = "JP") {
  const niceWars = await getNiceWarsFull(region);
  return niceWars.find(war => war.id == id);
}
