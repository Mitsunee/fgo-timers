import path from "path";
import { BundleFile } from "./Bundle";

export interface BuildInfo {
  date: number;
  version: string;
}

const filePath = path.join(process.cwd(), "assets/static/info.json");
export const BuildInfoFile = new BundleFile<BuildInfo>({
  name: "Build Info",
  filePath
});

/**
 * Reads build info from prebuild step
 * @returns BuildInfo object
 */
export const getBuildInfo = BuildInfoFile.readBundle.bind(BuildInfoFile);

/**
 * Writes build info
 * @param data BuildInfo object
 * @returns FileWriteResult
 */
export const writeBuildInfo = BuildInfoFile.writeBundle.bind(BuildInfoFile);
