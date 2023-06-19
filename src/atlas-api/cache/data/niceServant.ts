import path from "path";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { Log } from "~/utils/log";
import { cachedJson } from "../cachedFile";

export const paths = {
  JP: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/servant/nice_servant_jp.json"
  ),
  NA: path.join(
    process.cwd(),
    ".next/cache/atlasacademy/servant/nice_servant_na.json"
  )
};

export const File = cachedJson<Servant[]>({
  limitPath: ".next/cache/atlasacademy/servant"
});

function getServantFromArray(id: number, servants: Servant[]) {
  const servant = servants.find(servant => servant.id == id);
  if (!servant) {
    Log.throw(`Could not find servant with id ${id}`);
  }

  return servant;
}

/**
 * Gets niceServant export, either full export or filtered by specific ids.
 * @param ids ids of servants to get (default: all servants). Set as `null` if you want all servants but use the `region` parameter.
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If any id can not be found
 * @returns Array of Servants
 */
export async function getNiceServants(
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
 * Gets specific servants data
 * @param id id of servant to get
 * @param region Region `"NA"` or `"JP"` (default: `"JP"`)
 * @throws If id can not be found
 * @returns Servant
 */
export async function getNiceServant(
  id: number,
  region: SupportedRegion = "JP"
) {
  const niceServants = await getNiceServants(null, region);
  return getServantFromArray(id, niceServants);
}
