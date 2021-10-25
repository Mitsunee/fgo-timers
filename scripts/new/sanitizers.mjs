import { join, dirname, basename, extname } from "path";

import { capitalize } from "../shared/capitalize.mjs";

export function sanitizeComponentName(name) {
  // remove file extension and illegal characters, then capitalize
  return capitalize(name.replace(/\.[a-z]$/i, "").replace(/[^a-z]/gi, ""));
}

export function sanitizePageFileName(name) {
  return join(
    dirname(name),
    `${basename(name, extname(name))
      .toLowerCase()
      .replace(/[^a-z]/g, "")}.jsx`
  );
}
