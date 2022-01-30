/* createServerError
 * Creates Error with message and optional parent
 */
import { isAbsolute } from "path";
import { toRelativePath } from "@foxkit/node-util/path";

export function createServerError(message, parent = null) {
  return new Error(
    `${message}${
      parent
        ? ` in '${isAbsolute(parent) ? toRelativePath(parent) : parent}'`
        : ""
    }`
  );
}
