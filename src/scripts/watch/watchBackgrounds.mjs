import { watch } from "chokidar";
import { getFileName } from "@foxkit/node-util/path";
import { writeFile } from "@foxkit/node-util/fs";

import * as log from "../utils/log.mjs";
import { optionsBase } from "./constants.mjs";
import { buildToArray } from "./builders.mjs";

export function watchBackgrounds() {
  let timeout, hasBuilt;

  //make watcher
  const watcher = watch(
    "public/assets/backgrounds/landing/*.jpg", // BUG: does not support PNG backgrounds
    /* about above:
       chokidar uses picomatch which does not support {jpg|png} brace expansion.
       It seems like j?pn?g also doesn't work, so I chose to temporarily disable
       support for png backgrounds. As of writing there are only jpg backgrounds,
       so this shouldn't be an issue yet.
    */
    optionsBase
  );
  const bundle = new Set();

  // bundle methods
  async function writeBundle() {
    await writeFile("assets/static/backgrounds.json", buildToArray(bundle));
    hasBuilt = true;
    log.ready("Built bundle", "assets/static/backgrounds.json");
  }

  function scheduleBuild() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(writeBundle, 2500);
  }

  // event handlers
  function addFile(path, action) {
    bundle.add(getFileName(path));
    if (action) log.info(action, path);
    scheduleBuild();
  }

  function removeFile(path) {
    bundle.delete(getFileName(path));
    log.info("File removed", path);
    scheduleBuild();
  }

  // attach watcher events
  watcher.on("add", path => addFile(path, hasBuilt && "File added"));
  watcher.on("change", path => addFile(path, "File changed"));
  watcher.on("unlink", path => removeFile(path));
}
