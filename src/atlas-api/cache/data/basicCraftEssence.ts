import path from "path";
import { CacheFile } from "../CacheFile";

export const paths = {
  JP: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/craftEssence/basic_equip_jp.json"
  ),
  NA: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/craftEssence/basic_equip_na.json"
  )
};

export const BasicCraftEssence = new CacheFile({
  name: "Basic Craft Essence",
  fetcher: connector => connector.craftEssenceList(),
  paths
});

/**
 * Gets basic equip export (Craft Essences)
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns basic equip export
 */
export async function getBasicCraftEssencesFull(
  region: SupportedRegion = "JP"
) {
  const filePath = paths[region];
  const res = await BasicCraftEssence.readFile(filePath);
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
