import { globby } from "globby";
import { log, die } from "@foxkit/node-util/log";

import { isRoot } from "./shared/isRoot.mjs";
import { buildComponents } from "./build-svg/buildComponents.mjs";
import { buildIndex } from "./build-svg/buildIndex.mjs";
import { cleanupComponents } from "./build-svg/cleanupComponents.mjs";

async function main() {
  const svgFiles = await globby("assets/svg/!(*inkscape).svg");
  const components = await buildComponents(svgFiles);
  await buildIndex(components);
  await cleanupComponents(components);
  log.success(`Built ${components.length} Components`);
}

isRoot();
main().catch(e => die(e));
