import { watch } from "chokidar";
import { getFileName } from "@foxkit/node-util/path";

import * as log from "../utils/log.mjs";
import { optionsBase } from "./constants.mjs";
import { buildSVGComponentIndex } from "../utils/svg/buildComponentIndex.mjs";
import { buildSVGComponent } from "../utils/svg/buildComponent.mjs";
import { getComponentName } from "../utils/svg/getComponentName.mjs";
import { removeSvgComponent } from "../utils/svg/removeComponent.mjs";

export function watchSvgs() {
  let timeout, hasBuilt;

  //make watcher
  const watcher = watch("assets/svg/!(*inkscape).svg", optionsBase);
  const components = new Set();
  const componentNameMap = new Map();

  // bundle methods
  async function writeBundle() {
    await buildSVGComponentIndex(components);
    hasBuilt = true;
    log.ready("Built Icon index", "src/components/icons/index.js"); // NOTE: change when moving client src
  }

  function scheduleBuild() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(writeBundle, 2500);
  }

  // event handlers
  function addFile(path, action) {
    const componentName = getComponentName(getFileName(path, false));

    // check for naming conflicts
    if (componentNameMap.has(componentName)) {
      const mappedPath = componentNameMap.get(componentName);
      if (mappedPath !== path) {
        log.error(
          `Name conflict between '${getFileName(path)}' and '${getFileName(
            mappedPath
          )}' for name '${componentName}'`
        );
        return;
      }
    }

    components.add(componentName);
    componentNameMap.set(componentName, path);
    buildSVGComponent({ file: path, componentName }).then(() => {
      if (action) log.info(action, path);
      scheduleBuild();
    });
  }

  function removeFile(path) {
    const componentName = getComponentName(getFileName(path, false));

    // remove from components set and name map if this file previously had the monopoly for its componentName
    if (componentNameMap.get(componentName) === path) {
      components.delete(componentName);
      componentNameMap.delete(componentName);
    }

    // NOTE: change when moving client src
    removeSvgComponent(`src/components/icons/${componentName}.jsx`, true).then(
      () => {
        log.info("SVG Icon and Component removed", path);
        scheduleBuild();
      }
    );
  }

  // attach watcher events
  watcher.on("add", path => addFile(path, hasBuilt && "SVG Icon added"));
  watcher.on("change", path => addFile(path, "SVG Component rebuilt"));
  watcher.on("unlink", path => removeFile(path));
}
