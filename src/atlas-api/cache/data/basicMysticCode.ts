import path from "path";
import type { MysticCodeBasic } from "@atlasacademy/api-connector/dist/Schema/MysticCode";
import { cachedJson } from "../cachedFile";
import type { ApiDataFetcher, PathsMap } from "../types";

export const paths = {
  JP: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/basicMysticCode/basic_mystic_code_jp.json"
  ),
  NA: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/basicMysticCode/basic_mystic_code_na.json"
  )
} satisfies PathsMap;

export const name = "Basic Mystic Code";
export const File = cachedJson<MysticCodeBasic[]>({ paths });
export const Fetcher: ApiDataFetcher<MysticCodeBasic[]> = connector =>
  connector.mysticCodeList();

/**
 * Gets basic Mystic Code export
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns basic Mystic Code export
 */
export async function getBasicMysticCodesFull(region: SupportedRegion = "JP") {
  const filePath = paths[region];
  const res = await File.readFile(filePath);
  if (!res.success) throw res.error;
  return res.data;
}

/**
 * Gets basic data of Mystic Codes by id
 * @param ids ids of Mystic Codes to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Array of Mystic Codes (may include undefined if any id was not found)
 */
export async function getBasicMysticCodes(
  ids: number[],
  region: SupportedRegion = "JP"
) {
  const basicMysticCodes = await getBasicMysticCodesFull(region);
  return ids.map(id =>
    basicMysticCodes.find(mysticCode => mysticCode.id == id)
  );
}

/**
 * Gets basic Mystic Code data by id
 * @param id id of Mystic Code to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Mystic Code or undefined if not found
 */
export async function getBasicMysticCode(
  id: number,
  region: SupportedRegion = "JP"
) {
  const basicMysticCodes = await getBasicMysticCodesFull(region);
  return basicMysticCodes.find(mysticCode => mysticCode.id == id);
}
