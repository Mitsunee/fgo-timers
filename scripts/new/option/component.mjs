import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { createSpinner } from "nanospinner";

import { sanitizeComponentName } from "../sanitizers.mjs";
import { resolveFilePath } from "../../shared/path-helper.mjs";
import { writeFile } from "../../shared/fs-helper.mjs";
import { format } from "../../shared/format.mjs";
import { buildLog, printBuildLog } from "../buildLog.mjs";

export async function optionComponent(args) {
  const [parent, ...children] = args;
  const parentComponent = sanitizeComponentName(parent);
  const childComponents = children
    ? children.map(child => sanitizeComponentName(child))
    : [];
  const dirPath = resolveFilePath("src/components", parentComponent);
  const indexPath = resolveFilePath(dirPath, "index.js");
  const parentCssPath = resolveFilePath(
    dirPath,
    `${parentComponent}.module.css`
  );
  const parentPath = resolveFilePath(dirPath, `${parentComponent}.jsx`);
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
    const childCssPath = resolveFilePath(
      dirPath,
      `${childComponent}.module.css`
    );
    const childPath = resolveFilePath(dirPath, `${childComponent}.jsx`);

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
  }

  // log
  spinner.success();
  printBuildLog();
}
