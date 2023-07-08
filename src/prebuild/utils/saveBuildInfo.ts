import path from "path";
import { BuildInfoFile } from "~/static/bundleInfo";
import { Log } from "~/utils/log";
import type { ApiCacheInfo } from "~/atlas-api/cache/info";
import type { BuildInfo } from "~/static/bundleInfo";

export function makeBuildVer(cacheInfo: ApiCacheInfo): string {
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

export async function saveBuildInfo(cacheInfo: ApiCacheInfo) {
  const buildInfo: BuildInfo = {
    date: Math.floor(Date.now() / 1000),
    version: makeBuildVer(cacheInfo)
  };
  const res = await BuildInfoFile.writeBundle(buildInfo);
  if (!res.success) {
    Log.throw(`Failed to write bundle info:`, res.error);
  }

  Log.ready(
    `Saved build info ${Log.styleParent(
      path.relative(process.cwd(), BuildInfoFile.filePath)
    )}`
  );
  return buildInfo;
}
