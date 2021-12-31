import { join, dirname } from "path";
import { getFileName } from "@foxkit/node-util/path";

import { capitalize } from "../shared/capitalize.mjs";

export function sanitizeComponentName(name) {
  // remove file extension and illegal characters, then capitalize
  return capitalize(name.replace(/\.[a-z]$/i, "").replace(/[^a-z]/gi, ""));
}

export function sanitizePageFileName(name) {
  return join(
    dirname(name),
    `${getFileName(name, false)
      .toLowerCase()
      .replace(/[^a-z]/g, "")}.jsx`
  );
}
