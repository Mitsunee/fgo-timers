import path from "path";
import type { ServantWithLore } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { cachedJson } from "../cachedFile";
import type { PathsMap } from "../types";

export const paths = {
  JP: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/servant/nice_servant_jp.json"
  ),
  NA: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/servant/nice_servant_na.json"
  )
} satisfies PathsMap;

export const File = cachedJson<ServantWithLore[]>({ paths });

/**
 * Gets nice Servant export (with lore)
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns nice Servant export
 */
export async function getNiceServantsFull(region: SupportedRegion = "JP") {
  const filePath = paths[region];
  const res = await File.readFile(filePath);
  if (!res.success) throw res.error;
  return res.data;
}

/**
 * Gets nice data of Servants by id
 * @param ids ids of Servants to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Array of Servants (may include undefined if any id was not found)
 */
export async function getNiceServants(
  ids: number[],
  region: SupportedRegion = "JP"
) {
  const niceServants = await getNiceServantsFull(region);
  return ids.map(id => niceServants.find(servant => servant.id == id));
}

/**
 * Gets nice Servant data by id
 * @param id id of Servant to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Servant or undefined if not found
 */
export async function getNiceServant(
  id: number,
  region: SupportedRegion = "JP"
) {
  const niceServants = await getNiceServantsFull(region);
  return niceServants.find(servant => servant.id == id);
}
