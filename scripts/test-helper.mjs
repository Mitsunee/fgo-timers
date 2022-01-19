import { isRoot } from "./shared/isRoot.mjs";
import { helpFn } from "./test-helper/helpFn.mjs";
import { isFn } from "./test-helper/isFn.mjs";
import { setFn } from "./test-helper/setFn.mjs";

isRoot();

async function main(option, value = null) {
  const silent = process.argv.includes("--silent");

  switch (option) {
    case "help":
    case "--help":
    case "-h":
      helpFn();
      break;
    case "is":
      await isFn(value, silent);
      break;
    case "set":
      await setFn(value, silent);
      break;
    case "precommit":
      await isFn("cjs", true);
      break;
    case "reset":
      await setFn("cjs", silent);
      break;
    default:
      helpFn(true); // as error-fallback for bad option
  }
}

// run program
const [, , option, value] = process.argv;
main(option, value);
