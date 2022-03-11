import { getFileName } from "@foxkit/node-util/path";

export const buildToArray = bundle => Array.from(bundle.values());
export const buildToObject = bundle => {
  const build = new Object();
  for (const [path, data] of bundle.entries()) {
    const file = getFileName(path, false);
    build[file] = data;
  }
  return build;
};
