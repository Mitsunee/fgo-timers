import { getFileName } from "@foxkit/node-util/path";

export function getComponentName(filePath) {
  return `Icon-${getFileName(filePath, false)}`
    .replace(/^[a-z]/, c => c.toUpperCase())
    .replace(/[_-][a-z]/g, c => c.substring(1).toUpperCase())
    .replace(/[^a-z]/gi, "");
}
