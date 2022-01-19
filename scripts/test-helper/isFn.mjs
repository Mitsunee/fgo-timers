import { readFileJson } from "@foxkit/node-util/fs";
import { log, die } from "@foxkit/node-util/log";

export async function isFn(value, silent) {
  if (value !== "esm" && value !== "cjs") {
    die(`Provided value must be either esm or cjs`);
  }

  const pkg = await readFileJson("package.json");
  const currentValue = pkg.type === "module" ? "esm" : "cjs";

  if (currentValue !== value) {
    die(`Check failed: module type is ${currentValue} instead of ${value}`);
  }

  if (!silent) log.success(`Confirmed module type to be ${value}`);
  process.exit(0);
}
