import path from "path";
import type { CraftEssenceBasic } from "@atlasacademy/api-connector/dist/Schema/CraftEssence";
import { cachedJson } from "../cachedFile";
import type { ApiDataFetcher, PathsMap } from "../types";

export const paths = {
  JP: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/craftEssence/basic_equip_jp.json"
  ),
  NA: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/craftEssence/basic_equip_na.json"
  )
} satisfies PathsMap;

export const File = cachedJson<CraftEssenceBasic[]>({ paths });
export const Fetcher: ApiDataFetcher<CraftEssenceBasic[]> = connector =>
  connector.craftEssenceList();

/**
 * Gets basic equip export (Craft Essences)
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns basic equip export
 */
export async function getBasicCraftEssencesFull(
  region: SupportedRegion = "JP"
) {
  const filePath = paths[region];
  const res = await File.readFile(filePath);
  if (!res.success) throw res.error;
  return res.data;
}

/**
 * Gets basic data of Craft Essences by id
 * @param ids ids of Craft Essences to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Array of Craft Essences (may include undefined if any id was not found)
 */
export async function getBasicCraftEssences(
  ids: number[],
  region: SupportedRegion = "JP"
) {
  const basicCraftEssences = await getBasicCraftEssencesFull(region);
  return ids.map(id =>
    basicCraftEssences.find(craftEssence => craftEssence.id == id)
  );
}

/**
 * Gets basic Craft Essence data by id
 * @param id id of Craft Essence to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Craft Essence data or undefined if not found
 */
export async function getBasicCraftEssence(
  id: number,
  region: SupportedRegion = "JP"
) {
  const basicCraftEssences = await getBasicCraftEssencesFull(region);
  return basicCraftEssences.find(craftEssence => craftEssence.id == id);
}
