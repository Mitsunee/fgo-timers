import { readFile, writeFile } from "@foxkit/node-util/fs";

import { svgo, svgToJsx } from "./svgo.mjs";
import { format } from "./format.mjs";

export async function buildSVGComponent(filePath, componentName) {
  const fileContent = await readFile(filePath);
  if (!fileContent) {
    throw new Error(`Could not read file: ${filePath}`);
  }
  const svg = await svgo(fileContent);
  const jsx = await svgToJsx(svg);
  await writeFile(
    `src/client/components/icons/${componentName}.tsx`,
    await format(`
      export function ${componentName}(props: React.ComponentProps<"svg">) {
        return ${jsx}
      }
    `)
  );
}
