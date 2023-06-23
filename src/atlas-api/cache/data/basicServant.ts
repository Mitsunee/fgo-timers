import path from "path";
import type { ServantBasic } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { cachedJson } from "../cachedFile";
import type { ApiDataFetcher, PathsMap } from "../types";

export const paths = {
  JP: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/basicServant/basic_servant_jp.json"
  ),
  NA: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/basicServant/basic_servant_na.json"
  )
} satisfies PathsMap;

export const name = "Basic Servant";
export const File = cachedJson<ServantBasic[]>({ paths });
export const Fetcher: ApiDataFetcher<ServantBasic[]> = connector =>
  connector.servantList();

/**
 * Gets basic Servant export
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns basic Servant export
 */
export async function getBasicServantsFull(region: SupportedRegion = "JP") {
  const filePath = paths[region];
  const res = await File.readFile(filePath);
  if (!res.success) throw res.error;
  return res.data;
}

/**
 * Gets basic data of Servants by id
 * @param ids ids of Servants to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Array of Servants (may include undefined if any id was not found)
 */
export async function getBasicServants(
  ids: number[],
  region: SupportedRegion = "JP"
) {
  const basicServants = await getBasicServantsFull(region);
  return ids.map(id => basicServants.find(servant => servant.id == id));
}

/**
 * Gets basic Servant data by id
 * @param id id of Servant to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @returns Servant or undefined if not found
 */
export async function getBasicServant(
  id: number,
  region: SupportedRegion = "JP"
) {
  const basicServants = await getBasicServantsFull(region);
  return basicServants.find(servant => servant.id == id);
}
