import { rm } from "fs/promises";
import { getFileName } from "@foxkit/node-util/path";

import { info } from "../log.mjs";

export async function removeSvgComponent(file) {
  info(
    `Removing ${getFileName(file)} as source file was removed`,
    "src/components/icons/" // NOTE: change when moving client src
  );
  await rm(file);
}
