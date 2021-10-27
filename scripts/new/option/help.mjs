import picocolors from "picocolors";

import { log } from "../../shared/log.mjs";
import { dd } from "../../shared/dedent.mjs";

export function optionHelp() {
  log(
    dd(`
      ${picocolors.bold("new")}

        yarn new option ...arguments

      ${picocolors.bold("options")}
        --help, -h, help: Shows this help text
        --component, -c, component: Create a new React Component
          -c componentName [...childName]
            componentName: Name of the globally accessible Component
            childName (optional): Names of any child components
        --page, -p, page: Create a new Next page
          -p fileName componentName
            fileName: file name of the page
            componentName: React Component name"
    `)
  );
}
