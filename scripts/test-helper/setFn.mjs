import { readFile, writeFile } from "@foxkit/node-util/fs";
import { log, die } from "@foxkit/node-util/log";

export async function setFn(value, silent) {
  let pkg = await readFile("package.json");
  const currentValue = JSON.parse(pkg).type === "module" ? "esm" : "cjs";

  if (currentValue === value) {
    if (!silent) log.success(`Module type ${value} is already set.`);
    process.exit(0);
  }

  const pkgArray = pkg.split("\n");
  const idx = pkgArray.findIndex(row => /"type":/.test(row));
  switch (value) {
    case "esm": {
      if (idx == -1) {
        const privateIdx = pkgArray.findIndex(row => /"private":/.test(row));
        const newType = pkgArray[privateIdx]
          .replace(`"private"`, `"type"`)
          .replace("true", `"module"`);

        pkg = [
          ...pkgArray.slice(0, privateIdx),
          newType,
          ...pkgArray.slice(privateIdx)
        ].join("\n");
      } else {
        const newType = pkgArray[idx].replace(`"${currentValue}"`, `"module"`);

        pkg = [
          ...pkgArray.slice(0, idx),
          newType,
          ...pkgArray.slice(idx + 1)
        ].join("\n");
      }
      break;
    }
    case "cjs": {
      if (idx >= 0) {
        pkg = [...pkgArray.slice(0, idx), ...pkgArray.slice(idx + 1)].join(
          "\n"
        );
      }
      break;
    }
    default:
      die(`Provided value must be either esm or cjs`);
  }

  await writeFile("package.json", pkg);
  if (!silent) log.success(`Set module type to ${value}`);

  if (value === "esm") {
    log.warn(
      "Do not commit package.json without first running 'test-helper reset'!"
    );
  }

  process.exit(0);
}
