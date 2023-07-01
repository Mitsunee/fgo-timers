import path from "path";
import { Log } from "~/utils/log";
import type { BundledNP } from "~/servants/types";
import { BundleFile } from "../Bundle";

export const name = "Noble Phantasms";
export const filePath = path.join(
  process.cwd(),
  "assets/static/data/noblePhantasms.json"
);
export const File = new BundleFile<PartialDataMap<BundledNP>>(filePath);

/**
 * Reads Noble Phantasms data bundle
 * @returns Bundled data
 */
export const getNoblePhantasmsFull = File.readFile.bind(File);

/**
 * Writes to Noble Phantasms data bundle
 * @param data Record Object of bundled Noble Phantasms
 * @returns FileWriteResult
 */
export const writeBundledNoblePhantasms = File.writeFile.bind(File);

/**
 * Reads specific Noble Phantasm's bundled data
 * @param id id of Noble Phantasm
 * @returns BundledNP or undefined if id not found
 */
export async function getNoblePhantasm(id: number) {
  return getNoblePhantasmsFull().then(map => map[id]);
}

/**
 * Creates Record of Noble Phantasms by id
 * @param ids ids of Noble Phantasms
 * @returns Record of Noble Phantasms
 * @throws if id was not found
 */
export async function createNoblePhantasmRecord(ids: number[] | Set<number>) {
  const record: DataMap<BundledNP> = {};
  const noblePhantasms = await getNoblePhantasmsFull();

  for (const id of ids) {
    if (record[id]) continue;

    const noblePhantasm = noblePhantasms[id];
    if (!noblePhantasm) {
      Log.throw(`Could not find noble phantasm with id ${id} in bundled data`);
    }

    record[id] = noblePhantasm;
  }

  return record;
}