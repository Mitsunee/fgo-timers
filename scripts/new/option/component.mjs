import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { createSpinner } from "nanospinner";
import { log } from "@foxkit/node-util/log";
import { resolvePath } from "@foxkit/node-util/path";
import { writeFile } from "@foxkit/node-util/fs";

import { sanitizeComponentName } from "../sanitizers.mjs";
import { format } from "../../shared/format.mjs";
import { buildLog, printBuildLog } from "../buildLog.mjs";

export async function optionComponent(args) {
  const [parent, ...children] = args;
  const parentComponent = sanitizeComponentName(parent);
  const childComponents = children
    ? children.map(child => sanitizeComponentName(child))
    : [];
  const dirPath = resolvePath("src/components", parentComponent);
  const indexPath = resolvePath(dirPath, "index.js");
  const parentCssPath = resolvePath(dirPath, `${parentComponent}.module.css`);
  const parentPath = resolvePath(dirPath, `${parentComponent}.jsx`);
  const spinner = createSpinner("Building Components");

  // prepare
  spinner.start();
  await mkdir(dirPath, { recursive: true });

  // index.js
  if (!existsSync(indexPath)) {
    await writeFile(
      indexPath,
      format(`
        import ${parentComponent} from "./${parentComponent}"
        export default ${parentComponent}
      `)
    );
    buildLog.push(indexPath);
  }

  // children
  for (const childComponent of childComponents) {
    const childCssPath = resolvePath(dirPath, `${childComponent}.module.css`);
    const childPath = resolvePath(dirPath, `${childComponent}.jsx`);

    if (!existsSync(childCssPath)) {
      await writeFile(childCssPath, "");
      buildLog.push(childCssPath);
    }

    if (!existsSync(childPath)) {
      writeFile(
        childPath,
        format(`
          //import styles from "./${childComponent}.module.css";

          export default function ${childComponent}() {return null}
        `)
      );
      buildLog.push(childPath);
    }
  }

  // parent
  if (!existsSync(parentCssPath)) {
    await writeFile(parentCssPath, "");
    buildLog.push(parentCssPath);
  }
  if (!existsSync(parentPath)) {
    await writeFile(
      parentPath,
      format(`//import styles from "./${parentComponent}.module.css";
        ${childComponents
          .map(
            childComponent =>
              `//import ${childComponent} from "./${childComponent}";`
          )
          .join("\n")}

        export default function ${parentComponent}() {return null}
      `)
    );
    buildLog.push(parentPath);
  }

  // log
  spinner.success();
  printBuildLog();
  log.success(
    `Successfully created ${parentComponent} (+ ${childComponents.length} child components)`
  );
}
