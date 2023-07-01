import { dirname } from "path";
import { ParsedFile } from "@foxkit/node-util/fs-extra";
import { Log } from "~/utils/log";
import type { ApiDataFetcher, PathsMap } from "./types";

type PartialPaths = Partial<PathsMap>;

export function generateLimitPath({ NA, JP }: PartialPaths) {
  if (NA && !JP) return NA;
  if (JP && !NA) return JP;
  if (!(NA && JP)) {
    throw new Error(`Empty paths object given`);
  }

  const dirNA = dirname(NA);
  const dirJP = dirname(JP);

  if (dirNA != dirJP) {
    Log.throw(
      new Error(`Given paths should be located in the same directory`),
      { NA, JP }
    );
  }

  if (!dirNA.includes(".next/cache/atlasacademy")) {
    Log.throw(
      new Error(`Given paths must be located in '.next/cache/atlasacademy'`),
      { NA, JP }
    );
  }

  return dirNA;
}

export class CacheFile<T> extends ParsedFile<T> {
  name: string;
  paths: PartialPaths;
  fetcher: ApiDataFetcher<T>;

  constructor(options: {
    name: string;
    paths: PartialPaths;
    fetcher: ApiDataFetcher<T>;
  }) {
    super({
      limitPath: generateLimitPath(options.paths),
      stringify: JSON.stringify,
      parse: JSON.parse,
      cache: true
    });
    this.name = options.name;
    this.paths = options.paths;
    this.fetcher = options.fetcher;
  }
}
