import path from "path";
import type { Item } from "@atlasacademy/api-connector/dist/Schema/Item";
import { cachedJson } from "../cachedFile";
import type { ApiDataFetcher, PathsMap } from "../types";

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

export const name = "Nice Item";
export const File = cachedJson<Item[]>({ paths });
export const Fetcher: ApiDataFetcher<Item[]> = connector =>
  connector.itemList();

/**
 * Gets nice Item export
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns nice Item export
 */
export async function getNiceItemsFull(region: SupportedRegion = "JP") {
  const filePath = paths[region];
  const res = await File.readFile(filePath);
  if (!res.success) throw res.error;
  return res.data;
}

/**
 * Gets nice data of Items by id
 * @param ids ids of Items to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Array of Items (may include undefined if any id was not found)
 */
export async function getNiceItems(
  ids: number[],
  region: SupportedRegion = "JP"
) {
  const niceItems = await getNiceItemsFull(region);
  return ids.map(id => niceItems.find(item => item.id == id));
}

/**
 * Gets nice Item data by id
 * @param id id of the Item to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Item or undefined if not found
 */
export async function getNiceItem(id: number, region: SupportedRegion = "JP") {
  const niceItems = await getNiceItemsFull(region);
  return niceItems.find(item => item.id == id);
}
