import path from "path";
import { BundleFile } from "./Bundle";

export interface BuildInfo {
  date: number;
  version: string;
}

export const name = "Build Info";
export const filePath = path.join(process.cwd(), "assets/static/info.json");
export const File = new BundleFile<BuildInfo>(filePath);

export const getBuildInfo = File.readFile.bind(File);
export const writeBuildInfo = File.writeFile.bind(File);
