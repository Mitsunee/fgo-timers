import { ParsedFile } from "@foxkit/node-util/fs-extra";
import type { PathsMap } from "./types";

type PartialPaths = Partial<PathsMap>;

export function generateLimitPath({ NA, JP }: { NA?: string; JP?: string }) {
  if (NA && !JP) return NA;
  if (JP && !NA) return JP;
  if (!(NA && JP)) {
    throw new Error(`Empty paths object given`);
  }

  let limitPath = "";
  for (let i = 0; i < NA.length; i++) {
    if (NA[i] != JP[i]) break;
    limitPath += NA[i];
  }

  if (!limitPath.includes(".next/cache/atlasacademy")) {
    throw new Error(
      `Given paths must be located in '.next/cache/atlasacademy'`
    );
  }

  return limitPath;
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

      // @ts-ignore
      // eslint-disable-next-line prefer-rest-params
      return Reflect.get(target, ...arguments);
    }
  });

  return proxy;
}
