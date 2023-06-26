import path from "path";
import { Log } from "~/utils/log";
import type { BundledCostume } from "~/items/types";
import { BundleFile } from "../Bundle";

export const name = "Costumes";
export const filePath = path.join(
  process.cwd(),
  "assets/static/data/costumes.json"
);
export const File = new BundleFile<PartialDataMap<BundledCostume>>(filePath);

/**
 * Reads Costumes data bundle
 * @returns Bundled data
 */
export const getCostumesFull = File.readFile.bind(File);

/**
 * Writes to Costumes data bundle
 * @param data Record Object of bundled Costumes
 * @returns FileWriteResult
 */
export const writeBundledCostumes = File.writeFile.bind(File);

/**
 * Reads specific Costume's bundled data
 * @param id id of Costume
 * @returns BundledCostume or undefined if id not found
 */
export async function getCostume(id: number) {
  return getCostumesFull().then(map => map[id]);
}

/**
 * Creates Record of Costumes by id
 * @param ids ids of Costumes
 * @returns Record of Costumes
 * @throws if id was not found
 */
export async function createCostumeRecord(ids: number[] | Set<number>) {
  const record: DataMap<BundledCostume> = {};
  const costumes = await getCostumesFull();

  for (const id of ids) {
    if (record[id]) continue;

    const costume = costumes[id];
    if (!costume) {
      Log.throw(`Could not find costume with id ${id} in bundled data`);
    }

    record[id] = costume;
  }

  return record;
}
