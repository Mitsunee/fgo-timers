import path from "path";
import type { Info } from "@atlasacademy/api-connector/dist/Schema/Info";
import { ParsedFile } from "@foxkit/node-util/fs-extra";
import { Log } from "~/utils/log";

export interface ApiCacheInfo {
  NA: number;
  JP: number;
  version: string;
  lastChecked: number;
}

const localInfoFilePath = path.join(
  process.cwd(),
  ".next/cache/atlasacademy/info.json"
);

const LocalInfoFile = new ParsedFile<ApiCacheInfo>({
  limitPath: localInfoFilePath,
  parse: JSON.parse,
  stringify: JSON.stringify
});

export async function getCacheInfo() {
  const res = await LocalInfoFile.readFile(localInfoFilePath);
  if (!res.success) return;
  return res.data;
}

export async function writeCacheInfo(newInfo: ApiCacheInfo) {
  const res = await LocalInfoFile.writeFile(localInfoFilePath, newInfo);
  if (!res.success) throw res.error;
  Log.info("Updated AtlasAcademy API Cache Info");
  return true;
}

export async function getApiInfo(): Promise<{ NA: Info; JP: Info }> {
  const res = await fetch("https://api.atlasacademy.io/info");
  if (!res.ok) {
    Log.throw("Could not connect to AtlasAcademy API");
  }

  return res.json();
}
