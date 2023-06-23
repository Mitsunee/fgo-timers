import path from "path";
import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest";
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

const niceQuestCache: Partial<Record<SupportedRegion, Quest[]>> = {};

/**
 * Generates nice Quest export from niceWar
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns nice Quest export
 */
export async function getNiceQuestsFull(region: SupportedRegion = "JP") {
  return (niceQuestCache[region] ??= (await getNiceWarsFull(region)).flatMap(
    war => war.spots.flatMap(spot => spot.quests)
  ));
}

/**
 * Gets nice data of Quests by id
 * @param ids ids of Quests to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Array of Quests (may include undefined if any id was not found)
 */
export async function getNiceQuests(
  ids: number[],
  region: SupportedRegion = "JP"
) {
  const niceQuests = await getNiceQuestsFull(region);
  return ids.map(id => niceQuests.find(quest => quest.id == id));
}

/**
 * Gets nice Quest data by id
 * @param id id of Quest to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Quest or undefined if not found
 */
export async function getNiceQuest(id: number, region: SupportedRegion = "JP") {
  const niceQuests = await getNiceQuestsFull(region);
  return niceQuests.find(quest => quest.id == id);
}
