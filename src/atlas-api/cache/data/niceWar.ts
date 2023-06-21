import path from "path";
import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest";
import type { War } from "@atlasacademy/api-connector/dist/Schema/War";
import { Log } from "~/utils/log";
import { cachedJson } from "../cachedFile";
import type { PathsMap } from "../types";

export const paths = {
  JP: path.join(process.cwd(), ".next/cache/atlasacademy/war/nice_war_jp.json"),
  NA: path.join(process.cwd(), ".next/cache/atlasacademy/war/nice_war_na.json")
} satisfies PathsMap;

export const File = cachedJson<War[]>({
  limitPath: ".next/cache/atlasacademy/war"
});

const niceQuestCache: Partial<Record<SupportedRegion, Quest[]>> = {};

function getNiceQuestFromNiceWar(wars: War[], region: SupportedRegion) {
  const val = (niceQuestCache[region] ??= wars.flatMap(war =>
    war.spots.flatMap(spot => spot.quests)
  ));

  return val;
}

function getWarFromArray(id: number, wars: War[]) {
  const war = wars.find(war => war.id == id);
  if (!war) {
    Log.throw(`Could not find war with id ${id}`);
  }

  return war;
}

/**
 * Gets niceWar export, either full export or filtered by specific ids.
 * @param ids ids of wars to get (default: all wars). Set as `null` if you want all wars but use the `region` parameter.
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If any id can not be found
 * @returns Array of Wars
 */
export async function getNiceWars(
  ids?: number[] | null,
  region: SupportedRegion = "JP"
) {
  const filePath = paths[region];
  const res = await File.readFile(filePath);
  if (!res.success) throw res.error;
  if (!ids) return res.data;

  return ids.map(id => getWarFromArray(id, res.data));
}

/**
 * Gets specific war's data
 * @param id id of war to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If id can not be found
 * @returns War
 */
export async function getNiceWar(id: number, region: SupportedRegion = "JP") {
  const niceWars = await getNiceWars(null, region);
  return getWarFromArray(id, niceWars);
}

function getQuestFromArray(id: number, quests: Quest[]) {
  const quest = quests.find(quest => quest.id == id);
  if (!quest) {
    Log.throw(`Could not find quest with id ${id}`);
  }

  return quest;
}

/**
 * Generates niceQuest export from niceWar, either full export or filtered by specific ids.
 * @param ids ids of quests to get (default: all quests). Set as `null` if you want all quests but use the `region` parameter.
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If any id can not be found
 * @returns Array of Quests
 */
export async function getNiceQuests(
  ids: number[] | null,
  region: SupportedRegion = "JP"
) {
  const niceQuests = (niceQuestCache[region] ??= getNiceQuestFromNiceWar(
    await getNiceWars(null, region),
    region
  ));
  if (!ids) return niceQuests;

  return ids.map(id => getQuestFromArray(id, niceQuests));
}

/**
 * Gets specific quest's data
 * @param id id of quest to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If id can not be found
 * @returns Quest
 */
export async function getNiceQuest(id: number, region: SupportedRegion = "JP") {
  const niceQuests = await getNiceQuests(null, region);
  return getQuestFromArray(id, niceQuests);
}
