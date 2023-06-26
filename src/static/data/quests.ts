import path from "path";
import { Log } from "~/utils/log";
import type { BundledQuest } from "~/upgrades/types";
import { BundleFile } from "../Bundle";

export const name = "Quests";
export const filePath = path.join(
  process.cwd(),
  "assets/static/data/quests.json"
);
export const File = new BundleFile<PartialDataMap<BundledQuest>>(filePath);

/**
 * Reads Quests data bundle
 * @returns Bundled data
 */
export const getQuestsFull = File.readFile.bind(File);

/**
 * Writes to Quests data bundle
 * @param data Record Object of bundled Quests
 * @returns FileWriteResult
 */
export const writeBundledQuests = File.writeFile.bind(File);

/**
 * Reads specific Quest's bundled data
 * @param id id of Quest
 * @returns BundledQuest or undefined if id not found
 */
export async function getQuest(id: number) {
  return getQuestsFull().then(map => map[id]);
}

/**
 * Creates Record of Quests by id
 * @param ids ids of Quests
 * @returns Record of Quests
 * @throws if id was not found
 */
export async function createQuestRecord(ids: number[] | Set<number>) {
  const record: DataMap<BundledQuest> = {};
  const quests = await getQuestsFull();

  for (const id of ids) {
    if (record[id]) continue;

    const quest = quests[id];
    if (!quest) {
      Log.throw(`Could not find quest with id ${id} in bundled data`);
    }

    record[id] = quest;
  }

  return record;
}
