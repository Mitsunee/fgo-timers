import { writeFile } from "@foxkit/node-util/fs";
import { join } from "path";
import { Log } from "../../utils/log";
import type { AtlasCacheInfo } from "../../atlas-api/validation";

export function makeBuildVer(cacheInfo: AtlasCacheInfo): string {
  const JP = cacheInfo.JP.toString(36);
  const NA = cacheInfo.NA.toString(36);
  let matching = 0;
  const maxLen = Math.min(JP.length - 1, NA.length - 1);

  for (let i = 0; i < maxLen; i++) {
    if (JP.charCodeAt(i) == NA.charCodeAt(i)) {
      matching++;
    } else break;
  }

  return `${JP}:${NA.slice(matching)}.${cacheInfo.version.replace(
    /^0|\./g,
    ""
  )}`;
}

export async function saveBuildInfo(cacheInfo: AtlasCacheInfo) {
  const buildInfo: BuildInfo = {
    date: Math.floor(Date.now() / 1000),
    version: makeBuildVer(cacheInfo)
  };
  writeFile(join("assets", "static", "info.json"), buildInfo);
  Log.ready("Saved build info");
  return buildInfo;
}
