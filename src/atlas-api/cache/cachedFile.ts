import { dirname } from "path";
import { ParsedFile } from "@foxkit/node-util/fs-extra";
import { Log } from "~/utils/log";
import type { PathsMap } from "./types";

type PartialPaths = Partial<PathsMap>;

export function generateLimitPath({ NA, JP }: { NA?: string; JP?: string }) {
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

export function cachedJson<T>(options: { paths: PartialPaths }) {
  const cache: Partial<Record<string, { success: true; data: T }>> = {};

  const File = new ParsedFile<T>({
    limitPath: generateLimitPath(options.paths),
    stringify: JSON.stringify,
    parse: JSON.parse
  });

  const proxy = new Proxy(File, {
    get(target, p: string) {
      if (p == "readFile") {
        const readFileCached: (typeof target)["readFile"] = async filePath => {
          if (cache[filePath]) return cache[filePath]!; // no clue why this needs a !

          const res = await target.readFile(filePath);
          if (res.success) {
            cache[filePath] = res;
          }

          return res;
        };

        return readFileCached;
      }

      if (p == "writeFile") {
        const writeFileCached: (typeof target)["writeFile"] = async (
          filePath,
          fileContent
        ) => {
          cache[filePath] = { success: true, data: fileContent };
          return target.writeFile(filePath, fileContent);
        };

        return writeFileCached;
      }

      if (p == "limitPath") return target.limitPath;

      // @ts-ignore
      // eslint-disable-next-line prefer-rest-params
      return Reflect.get(target, ...arguments);
    }
  });

  return proxy;
}
