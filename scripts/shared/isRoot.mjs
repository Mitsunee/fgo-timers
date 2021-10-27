import { existsSync, readFileSync } from "fs";

import { resolveFilePath } from "./path-helper.mjs";
import { die } from "./log.mjs";

function checkRoot() {
  if (process.cwd().includes("node_modules")) return false;

  const pkgJsonPath = resolveFilePath("package.json");
  if (!existsSync(pkgJsonPath)) return false;

  const pkg = readFileSync(pkgJsonPath, "utf8");
  if (JSON.parse(pkg).name === "fgo-tools") {
    return true;
  }
  return false;
}

export function isRoot() {
  if (!checkRoot()) {
    die("Please run from project root directory!");
  }
}
