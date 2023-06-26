import path from "path";
import { Log } from "~/utils/log";
import type { BundledMysticCode } from "~/items/types";
import { BundleFile } from "../Bundle";

export const name = "Mystic Codes";
export const filePath = path.join(
  process.cwd(),
  "assets/static/data/mysticCodes.json"
);
export const File = new BundleFile<PartialDataMap<BundledMysticCode>>(filePath);

/**
 * Reads Mystic Codes data bundle
 * @returns Bundled data
 */
export const getMysticCodesFull = File.readFile.bind(File);

/**
 * Writes to Mystic Codes data bundle
 * @param data Record Object of bundled Mystic Codes
 * @returns FileWriteResult
 */
export const writeBundledMysticCodes = File.writeFile.bind(File);

/**
 * Reads specific Mystic Code's bundled data
 * @param id id of Mystic Code
 * @returns BundledMysticCode or undefined if id not found
 */
export async function getMysticCode(id: number) {
  return getMysticCodesFull().then(map => map[id]);
}

/**
 * Creates Record of Mystic Codes by id
 * @param ids ids of Mystic Codes
 * @returns Record of Mystic Codes
 * @throws if id was not found
 */
export async function createMysticCodeRecord(ids: number[] | Set<number>) {
  const record: DataMap<BundledMysticCode> = {};
  const mysticCodes = await getMysticCodesFull();

  for (const id of ids) {
    if (record[id]) continue;

    const mysticCode = mysticCodes[id];
    if (!mysticCode) {
      Log.throw(`Could not find mystic code with id ${id} in bundled data`);
    }

    record[id] = mysticCode;
  }

  return record;
}
