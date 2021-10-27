import { createSpinner } from "nanospinner";

import { writeFile } from "../shared/fs-helper.mjs";
import { format } from "../shared/format.mjs";

export async function buildIndex(components) {
  const spinner = createSpinner("Building 'index.js'");
  await writeFile(
    "src/components/icons/index.js",
    format(`
      ${components.map(name => `import ${name} from "./${name}"`).join("\n")}

      export {${components.join(",")}}
    `)
  );

  spinner.success({ text: "Built 'icons/index.js'" });
}
