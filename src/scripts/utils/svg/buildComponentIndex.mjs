import { writeFile } from "@foxkit/node-util/fs";

import { prettier } from "../prettier.mjs";

export async function buildSVGComponentIndex(components) {
  const list = new Array();

  for (const componentName of components) {
    list.push(`export {${componentName}} from "./${componentName}"`);
  }

  await writeFile(
    "src/components/icons/index.js", // NOTE: change when moving client src
    await prettier(list.join("\n"))
  );
}
