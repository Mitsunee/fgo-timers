import path from "path";
import type { War } from "@atlasacademy/api-connector/dist/Schema/War";
import { cachedJson } from "../cachedFile";
import type { ApiDataFetcher, PathsMap } from "../types";

export const paths = {
  JP: path.join(process.cwd(), ".next/cache/atlasacademy/war/nice_war_jp.json"),
  NA: path.join(process.cwd(), ".next/cache/atlasacademy/war/nice_war_na.json")
} satisfies PathsMap;

export const name = "Nice War & Nice Quest";
export const File = cachedJson<War[]>({ paths });
export const Fetcher: ApiDataFetcher<War[]> = connector =>
  connector.warListNice();

/**
 * Gets nice War export
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns nice War export
 */
export async function getNiceWarsFull(region: SupportedRegion = "JP") {
  const filePath = paths[region];
  const res = await File.readFile(filePath);
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
