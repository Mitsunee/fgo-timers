import path from "path";
import { Log } from "~/utils/log";
import type { BundledServant } from "~/servants/types";
import { BundleFile } from "../Bundle";

const filePath = path.join(process.cwd(), "assets/static/data/servants.json");
export const ServantsFile = new BundleFile<PartialDataMap<BundledServant>>({
  name: "Servants",
  filePath
});

/**
 * Reads Servants data bundle
 * @returns Bundled data
 */
export const getServantsFull = ServantsFile.readBundle.bind(ServantsFile);

/**
 * Writes to Servants data bundle
 * @param data Record Object of bundled Servants
 * @returns FileWriteResult
 */
export const writeBundledServants = ServantsFile.writeBundle.bind(ServantsFile);

/**
 * Reads specific Servant's bundled data
 * @param id id of Servant
 * @returns BundledServant or undefined if id not found
 */
export async function getServant(id: number) {
  return getServantsFull().then(map => map[id]);
}

/**
 * Creates Record of Servants by id
 * @param ids ids of Servants
 * @returns Record of Servants
 * @throws if id was not found
 */
export async function createServantRecord(ids: number[] | Set<number>) {
  const record: DataMap<BundledServant> = {};
  const servants = await getServantsFull();

  for (const id of ids) {
    if (record[id]) continue;

    const servant = servants[id];
    if (!servant) {
      Log.throw(`Could not find servant with id ${id} in bundled data`);
    }

    record[id] = servant;
  }

  return record;
}
