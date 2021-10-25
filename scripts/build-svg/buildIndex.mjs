import { createSpinner } from "nanospinner";

import { writeFile } from "../shared/fs-helper.mjs";
import { format } from "../shared/format.mjs";
import { log } from "../shared/log.mjs";

export async function buildIndex(componentNames) {
  const spinner = createSpinner("Building 'index.js'");
  await writeFile(
    "src/components/icons/index.js",
    format(`
      ${componentNames
        .map(name => `import ${name} from "./${name}"`)
        .join("\n")}

      export {${componentNames.join(",")}}
    `)
  );

  log.success("Built 'icons/index.js'", spinner);
}
