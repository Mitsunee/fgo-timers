import path from "path";
import { Log } from "~/utils/log";
import type { BundledCC } from "~/items/types";
import { BundleFile } from "../Bundle";

export const name = "Command Codes";
export const filePath = path.join(
  process.cwd(),
  "assets/static/data/commandCodes.json"
);
export const File = new BundleFile<PartialDataMap<BundledCC>>(filePath);

/**
 * Reads Command Codes data bundle
 * @returns Bundled data
 */
export const getCommandCodesFull = File.readFile.bind(File);

/**
 * Writes to Command Codes data bundle
 * @param data Record Object of bundled Command Codes
 * @returns FileWriteResult
 */
export const writeBundledCommandCodes = File.writeFile.bind(File);

/**
 * Reads specific Command Code's bundled data
 * @param id id of Command Code
 * @returns BundledServant or undefined if id not found
 */
export async function getCommandCode(id: number) {
  return getCommandCodesFull().then(map => map[id]);
}

/**
 * Creates Record of Command Codes by id
 * @param ids ids of Command Codes
 * @returns Record of Command Codes
 * @throws if id was not found
 */
export async function createCommandCodeRecord(ids: number[] | Set<number>) {
  const record: DataMap<BundledCC> = {};
  const commandCodes = await getCommandCodesFull();

  for (const id of ids) {
    if (record[id]) continue;

    const commandCode = commandCodes[id];
    if (!commandCode) {
      Log.throw(`Could not find command code with id ${id} in bundled data`);
    }

    record[id] = commandCode;
  }

  return record;
}
