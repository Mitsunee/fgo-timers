import { join } from "path";

export function resolveFilePath(filePath) {
  const test = /^[a-z0-9_-]/i.test(filePath);

  if (test) {
    return join(process.cwd(), filePath);
  }

  return filePath;
}
