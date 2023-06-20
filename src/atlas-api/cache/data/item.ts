import path from "path";
import type { Item } from "@atlasacademy/api-connector/dist/Schema/Item";
import { Log } from "~/utils/log";
import { cachedJson } from "../cachedFile";
import type { PathsMap } from "../types";

export const paths = {
  JP: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/item/nice_item_jp.json"
  ),
  NA: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/item/nice_item_na.json"
  )
} satisfies PathsMap;

export const File = cachedJson<Item[]>({
  limitPath: ".next/cache/atlasacademy/item"
});

function getItemFromArray(id: number, items: Item[]) {
  const item = items.find(item => item.id == id);
  if (!item) {
    Log.throw(`Could not find item with id ${id}`);
  }

  return item;
}

/**
 * Gets nice item export, either full export or filtered by specific ids.
 * @param ids ids of items to get (default: all items). Set as `null` if you want all items but use the `region`parameter.
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If any id can not be found
 * @returns Array of items
 */
export async function getNiceItems(
  ids?: number[] | null,
  region: SupportedRegion = "JP"
) {
  const filePath = paths[region];
  const res = await File.readFile(filePath);
  if (!res.success) throw res.error;
  if (!ids) return res.data;

  return ids.map(id => getItemFromArray(id, res.data));
}

/**
 * Gets specific item data
 * @param id id of the item to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If any id can not be found
 * @returns Item data
 */
export async function getNiceItem(id: number, region: SupportedRegion = "JP") {
  const niceItems = await getNiceItems(null, region);
  return getItemFromArray(id, niceItems);
}
