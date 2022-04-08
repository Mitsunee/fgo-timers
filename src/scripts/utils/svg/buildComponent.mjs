import { readFile, writeFile } from "@foxkit/node-util/fs";

import { svgo, svgToJsx } from "./svgo.mjs";
import { prettier } from "../prettier.mjs";

export async function buildSVGComponent({ file, componentName }) {
  const fileContent = await readFile(file);
  const svg = await svgo(fileContent);
  const jsx = await svgToJsx(svg);
  await writeFile(
    `src/client/components/icons/${componentName}.jsx`,
    await prettier(`
      export function ${componentName}(props) {
        return ${jsx}
      }
    `)
  );
}
