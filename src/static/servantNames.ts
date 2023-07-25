import path from "path";
import { BundleFile } from "./Bundle";

const filePath = path.join(process.cwd(), "assets/static/servant_names.json");
export const ServantNamesFile = new BundleFile<Partial<Record<number, string>>>(
  {
    name: "Servant Names",
    filePath
  }
);

/**
 * Reads Servant Names bundle
 * @returns Bundled data
 */
export const getBundledServantNames =
  ServantNamesFile.readBundle.bind(ServantNamesFile);

/**
 * Writes to Servant Names bundle
 * @param data Record of names for all Servants
 * @returns FileWriteResult
 */
export const writeBundledServantNames =
  ServantNamesFile.writeBundle.bind(ServantNamesFile);
