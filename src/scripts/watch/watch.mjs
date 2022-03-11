import chokidar from "chokidar";
import { getFileName } from "@foxkit/node-util/path";
import { writeFile } from "@foxkit/node-util/fs";

import * as log from "../utils/log.mjs";
import { parseDataFile } from "../utils/data-assets/parseDataFile.mjs";
import { prepareAtlasCache } from "../utils/atlasacademy/prepareCache.mjs";

const optionsBase = {
  awaitWriteFinish: true,
  cwd: process.cwd()
};

function watchBundle(dataPath, bundlePath, buildHandler, options = {}) {
  let timeout, hasBuilt;
  // make watcher
  const watcher = chokidar.watch(dataPath, { ...optionsBase, ...options });
  const bundle = new Map();

  // bundle methods
  async function writeBundle() {
    await writeFile(bundlePath, buildHandler(bundle));
    hasBuilt = true;
    log.ready("Built bundle", bundlePath);
  }

  function scheduleBuild() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(writeBundle, 2500);
  }

  // event handlers
  async function tryParse(path, showLog) {
    if (showLog) log.info(showLog, path);
    try {
      const { data } = await parseDataFile(path);
      bundle.set(path, data);
      scheduleBuild();
    } catch (e) {
      log.error(e.message, getFileName(path));
    }
  }

  function removeFile(path) {
    bundle.delete(path);
    log.info("File removed", path);
    scheduleBuild();
  }

  // attach watcher events
  watcher.on("add", path => tryParse(path, hasBuilt && "File added"));
  watcher.on("change", path => tryParse(path, "File changed"));
  watcher.on("unlink", path => removeFile(path));
}

const handleBuildToArray = bundle => Array.from(bundle.values());
const handleBuildToObject = bundle => {
  const build = new Object();
  for (const [path, data] of bundle.entries()) {
    const file = getFileName(path, false);
    build[file] = data;
  }
  return build;
};

// TODO: add the other things prebuild does

(async function main() {
  await prepareAtlasCache();

  watchBundle(
    "assets/data/events/*.yml",
    "assets/static/events.json",
    handleBuildToArray
  );
  watchBundle(
    "assets/data/login-tickets/*.yml",
    "assets/static/loginTickets.json",
    handleBuildToObject
  );
  watchBundle(
    ["assets/data/manaPrismShop.yml", "assets/data/rarePrismShop.yml"],
    "assets/static/shops.json",
    handleBuildToObject,
    { disableGlobbing: true }
  );
})();
