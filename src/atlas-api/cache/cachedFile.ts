import { ParsedFile } from "@foxkit/node-util/fs-extra";

export function cachedJson<T>(options: { limitPath?: string }) {
  const cache: Partial<Record<string, { success: true; data: T }>> = {};

  const File = new ParsedFile<T>({
    limitPath: options.limitPath,
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
