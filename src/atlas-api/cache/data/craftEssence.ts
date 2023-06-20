import path from "path";
import type { CraftEssenceBasic } from "@atlasacademy/api-connector/dist/Schema/CraftEssence";
import { Log } from "~/utils/log";
import { cachedJson } from "../cachedFile";
import type { PathsMap } from "../types";

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

export const File = cachedJson<CraftEssenceBasic[]>({
  limitPath: ".next/cache/atlasacademy/craftEssence"
});

function getCraftEssenceFromArray(
  id: number,
  craftEssences: CraftEssenceBasic[]
) {
  const craftEssence = craftEssences.find(
    craftEssence => craftEssence.id == id
  );
  if (!craftEssence) {
    Log.throw(`Could not find craft essence with id ${id}`);
  }

  return craftEssence;
}

/**
 * Gets basic equip export (Craft Essences), either full export or filtered by specific ids.
 * @param ids ids of craft essences to get (default: all craft essences). Set as `null` if you want all craft essences but use the `region`parameter.
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If any id can not be found
 * @returns Array of craft essences
 */
export async function getBasicCraftEssences(
  ids?: number[] | null,
  region: SupportedRegion = "JP"
) {
  const filePath = paths[region];
  const res = await File.readFile(filePath);
  if (!res.success) throw res.error;
  if (!ids) return res.data;

  return ids.map(id => getCraftEssenceFromArray(id, res.data));
}

/**
 * Gets specific craft essence data
 * @param id id of craft essence to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If any id can not be found
 * @returns Craft Essence data
 */
export async function getBasicCraftEssence(
  id: number,
  region: SupportedRegion = "JP"
) {
  const basicCraftEssences = await getBasicCraftEssences(null, region);
  return getCraftEssenceFromArray(id, basicCraftEssences);
}
