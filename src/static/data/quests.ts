import path from "path";
import { Log } from "~/utils/log";
import { safeProxyDataMap } from "~/utils/safeProxyDataMap";
import type { BundledQuest } from "~/upgrades/types";
import { BundleFile } from "../Bundle";

const filePath = path.join(process.cwd(), "assets/static/data/quests.json");
export const QuestsFile = new BundleFile<PartialDataMap<BundledQuest>>({
  name: "Quests",
  filePath
});

/**
 * Reads Quests data bundle
 * @returns Bundled data
 */
export const getQuestsFull = QuestsFile.readBundle.bind(QuestsFile);

/**
 * Writes to Quests data bundle
 * @param data Record Object of bundled Quests
 * @returns FileWriteResult
 */
export const writeBundledQuests = QuestsFile.writeBundle.bind(QuestsFile);

/**
 * Reads specific Quest's bundled data
 * @param id id of Quest
 * @returns BundledQuest or undefined if id not found
 */
export async function getQuest(id: number) {
  return getQuestsFull().then(map => map[id]);
}

/**
 * Proxy of Quests data bundle that throws if an id is not found
 * @returns Bundled data (proxied)
 */
export async function getQuestMap() {
  return safeProxyDataMap(
    await getQuestsFull(),
    "Could not find quest with id %KEY% in bundled data"
  );
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
