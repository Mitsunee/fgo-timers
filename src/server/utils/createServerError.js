import { isAbsolute } from "path";
import { toRelativePath } from "@foxkit/node-util/path";
import { error } from "./log";

export function createServerError(message, parent = false) {
  error(
    message,
    parent && (isAbsolute(parent) ? toRelativePath(parent) : parent)
  );

  return new Error(message);
}
