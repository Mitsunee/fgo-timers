import { error } from "../utils/log.mjs";

export function die(message) {
  error(message);
  process.exit(1);
}
