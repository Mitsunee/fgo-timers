import path from "path";
import { Log } from "~/utils/log";
import type { BundledItem } from "~/items/types";
import { BundleFile } from "../Bundle";

export const name = "Items";
export const filePath = path.join(
  process.cwd(),
  "assets/static/data/items.json"
);
export const File = new BundleFile<PartialDataMap<BundledItem>>(filePath);

/**
 * Reads Items data bundle
 * @returns Bundled data
 */
export const getItemsFull = File.readFile.bind(File);

/**
 * Writes to Items data bundle
 * @param data Record Object of bundled Items
 * @returns FileWriteResult
 */
export const writeBundledItems = File.writeFile.bind(File);

/**
 * Reads specific Item's bundled data
 * @param id id of Item
 * @returns BundledItem or undefined if id not found
 */
export async function getItem(id: number) {
  return getItemsFull().then(map => map[id]);
}

/**
 * Creates Record of Items by id
 * @param ids ids of Items
 * @returns Record of Items
 * @throws if id was not found
 */
export async function createItemRecord(ids: number[] | Set<number>) {
  const record: DataMap<BundledItem> = {};
  const items = await getItemsFull();

  for (const id of ids) {
    if (record[id]) continue;

    const item = items[id];
    if (!item) {
      Log.throw(`Could not find item with id ${id} in bundled data`);
    }

    record[id] = item;
  }

  return record;
}
