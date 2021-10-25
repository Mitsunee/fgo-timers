import { join, isAbsolute } from "path";

export function resolveFilePath(filePath, ...morePaths) {
  if (morePaths.length > 0) {
    const basePath = resolveFilePath(filePath);
    return join(basePath, ...morePaths);
  }

  if (!isAbsolute(filePath)) {
    return join(process.cwd(), filePath, ...morePaths);
  }

  return filePath;
}

export function toRelativePath(filePath) {
  if (!isAbsolute(filePath)) return filePath;

  return filePath.substring(process.cwd().length);
}
