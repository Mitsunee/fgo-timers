import path from "path";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { createSpinner } from "nanospinner";

import { die } from "../../shared/log.mjs";
import { resolveFilePath } from "../../shared/path-helper.mjs";
import { sanitizeComponentName, sanitizePageFileName } from "../sanitizers.mjs";
import { writeFile } from "../../shared/fs-helper.mjs";
import { buildLog, printBuildLog } from "../buildLog.mjs";
import { format } from "../../shared/format.mjs";

export async function optionPage(fileNameArg, componentNameArg) {
  if (!fileNameArg || !componentNameArg) {
    die("Must provide both arguments for 'page' option. See yarn new --help");
  }

  const dirPath = resolveFilePath("pages", path.dirname(fileNameArg));
  const componentName = sanitizeComponentName(componentNameArg);
  const filePath = resolveFilePath(
    dirPath,
    sanitizePageFileName(path.basename(fileNameArg))
  );
  const cssPath = resolveFilePath(
    "src",
    "styles",
    `${componentName}.module.css`
  );
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
}
