import prettier from "prettier";
import { dd } from "./dedent.mjs";

const config = {
  parser: "babel",
  ...prettier.resolveConfig.sync(process.cwd())
};

export function format(dirtyCode) {
  return prettier.format(dd(dirtyCode), config);
}
