import { join, isAbsolute } from "path";

export function resolveFilePath(filePath) {
  if (!isAbsolute(filePath)) {
    return join(process.cwd(), filePath);
  }

  return filePath;
}
