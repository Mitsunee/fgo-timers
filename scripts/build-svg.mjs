import { globby } from "globby";

import { buildComponents } from "./build-svg/buildComponents.mjs";
import { buildIndex } from "./build-svg/buildIndex.mjs";
import { cleanupComponents } from "./build-svg/cleanupComponents.mjs";
import { die } from "./shared/log.mjs";

async function main() {
  const svgFiles = await globby("assets/svg/!(*inkscape).svg");
  const componentNames = await buildComponents(svgFiles);
  await buildIndex(componentNames);
  await cleanupComponents(componentNames);
}

main().catch(e => die(e));
