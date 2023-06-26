import path from "path";
import { Log } from "~/utils/log";
import type { BundledCE } from "~/items/types";
import { BundleFile } from "../Bundle";

export const name = "Craft Essences";
export const filePath = path.join(
  process.cwd(),
  "assets/static/data/craftEssences.json"
);
export const File = new BundleFile<PartialDataMap<BundledCE>>(filePath);

/**
 * Reads Craft Essences data bundle
 * @returns Bundled data
 */
export const getCraftEssencesFull = File.readFile.bind(File);

/**
 * Writes to Craft Essences data bundle
 * @param data Record Object of bundled Craft Essences
 * @returns FileWriteResult
 */
export const writeBundledCraftEssences = File.writeFile.bind(File);

/**
 * Reads specific Craft Essence's bundled data
 * @param id id of Craft Essence
 * @returns BundledCE or undefined if id not found
 */
export async function getCraftEssence(id: number) {
  return getCraftEssencesFull().then(map => map[id]);
}

/**
 * Creates Record of Craft Essences by id
 * @param ids ids of Craft Essences
 * @returns Record of Craft Essences
 * @throws if id was not found
 */
export async function createCraftEssenceRecord(ids: number[] | Set<number>) {
  const record: DataMap<BundledCE> = {};
  const craftEssences = await getCraftEssencesFull();

  for (const id of ids) {
    if (record[id]) continue;

    const craftEssence = craftEssences[id];
    if (!craftEssence) {
      Log.throw(`Could not find craft essence with id ${id} in bundled data`);
    }

    record[id] = craftEssence;
  }

  return record;
}
