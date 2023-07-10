import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest";
import { getNiceWarsFull } from "./niceWar";

const niceQuestCache: {
  JP?: Quest[];
  NA?: Quest[];
} = {};

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
