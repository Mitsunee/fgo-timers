import path from "path";
import type { ServantBasic } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { Log } from "~/utils/log";
import { cachedJson } from "../cachedFile";
import type { PathsMap } from "../types";

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

export const File = cachedJson<ServantBasic[]>({
  limitPath: ".next/cache/atlasacademy/basicServant"
});

function getServantFromArray(id: number, servants: ServantBasic[]) {
  const servant = servants.find(servant => servant.id == id);
  if (!servant) {
    Log.throw(`Could not find servant with id ${id}`);
  }

  return servant;
}

/**
 * Gets basicServant export, either full export or filtered by specific ids.
 * @param ids ids of servants to get (default: all servants). Set as `null` if you want all servants but use the `region` parameter.
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If any id can not be found
 * @returns Array of basic Servants
 */
export async function getBasicServants(
  ids?: number[] | null,
  region: SupportedRegion = "JP"
) {
  const filePath = paths[region];
  const res = await File.readFile(filePath);
  if (!res.success) throw res.error;
  if (!ids) return res.data;

  return ids.map(id => getServantFromArray(id, res.data));
}

/**
 * Gets specific servants basic data
 * @param id id of servant to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If id can not be found
 * @returns Servant
 */
export async function getBasicServant(
  id: number,
  region: SupportedRegion = "JP"
) {
  const basicServants = await getBasicServants(null, region);
  return getServantFromArray(id, basicServants);
}
