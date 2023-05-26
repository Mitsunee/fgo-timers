import { writeFile } from "@foxkit/node-util/fs";
import { format } from "./format.mjs";

export async function buildSVGComponentIndex(components) {
  const list = components.map(
    componentName => `export {${componentName}} from "./${componentName}"`
  );
  await writeFile(
    "src/client/components/icons/index.ts",
    await format(list.join("\n"))
  );
}
