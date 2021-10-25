import { log } from "../shared/log.mjs";
import { toRelativePath } from "../shared/path-helper.mjs";

export const buildLog = new Array();
export function printBuildLog() {
  log.success(
    buildLog.map(file => `Created: .${toRelativePath(file)}`).join("\n")
  );
}
