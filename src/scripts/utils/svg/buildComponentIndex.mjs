import { writeFile } from "@foxkit/node-util/fs";

import { prettier } from "../prettier.mjs";

export async function buildSVGComponentIndex(components) {
  const list = Array.from(components).map(
    componentName => `export {${componentName}} from "./${componentName}"`
  );

  await writeFile(
    "src/client/components/icons/index.js",
    await prettier(list.join("\n"))
  );
}
