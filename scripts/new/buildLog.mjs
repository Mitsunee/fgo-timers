import { log } from "@foxkit/node-util/log";
import { toRelativePath } from "@foxkit/node-util/path";

export const buildLog = new Array();
export function printBuildLog() {
  log(buildLog.map(file => `Created: .${toRelativePath(file)}`).join("\n"));
}
