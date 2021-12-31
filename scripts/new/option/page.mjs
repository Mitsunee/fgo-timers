import { dirname } from "path";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { createSpinner } from "nanospinner";
import { log, die } from "@foxkit/node-util/log";
import { getFileName, resolvePath } from "@foxkit/node-util/path";
import { writeFile } from "@foxkit/node-util/fs";

import { sanitizeComponentName, sanitizePageFileName } from "../sanitizers.mjs";
import { buildLog, printBuildLog } from "../buildLog.mjs";
import { format } from "../../shared/format.mjs";

export async function optionPage(fileNameArg, componentNameArg) {
  if (!fileNameArg || !componentNameArg) {
    die("Must provide both arguments for 'page' option. See yarn new --help");
  }

  const dirPath = resolvePath("pages", dirname(fileNameArg));
  const componentName = sanitizeComponentName(componentNameArg);
  const filePath = resolvePath(
    dirPath,
    sanitizePageFileName(getFileName(fileNameArg))
  );
  const cssPath = resolvePath("src", "styles", `${componentName}.module.css`);
  const spinner = createSpinner("Building Page");

  // prepare
  spinner.start();
  await mkdir(dirPath, { recursive: true });

  // build
  if (!existsSync(cssPath)) {
    await writeFile(cssPath, "");
    buildLog.push(cssPath);
  }
  if (!existsSync(filePath)) {
    await writeFile(
      filePath,
      format(`
        //import styles from "@styles/${componentName}.module.css";

        export default function ${componentName}() {return null}
      `)
    );
    buildLog.push(filePath);
  }

  // log
  spinner.success();
  printBuildLog();
  log.success(`Successfully created ${getFileName(filePath, false)} route`);
}
