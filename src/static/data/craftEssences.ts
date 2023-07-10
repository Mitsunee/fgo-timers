import path from "path";
import { Log } from "~/utils/log";
import type { BundledCraftEssence } from "~/items/types";
import { BundleFile } from "../Bundle";

const filePath = path.join(
  process.cwd(),
  "assets/static/data/craft_essences.json"
);
export const CraftEssencesFile = new BundleFile<
  PartialDataMap<BundledCraftEssence>
>({
  name: "Craft Essences",
  filePath
});

/**
 * Reads Craft Essences data bundle
 * @returns Bundled data
 */
export const getCraftEssencesFull =
  CraftEssencesFile.readBundle.bind(CraftEssencesFile);

/**
 * Writes to Craft Essences data bundle
 * @param data Record Object of bundled Craft Essences
 * @returns FileWriteResult
 */
export const writeBundledCraftEssences =
  CraftEssencesFile.writeBundle.bind(CraftEssencesFile);

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
  const record: DataMap<BundledCraftEssence> = {};
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
