import { log } from "./shared/log.mjs";
import { isRoot } from "./shared/isRoot.mjs";
import { handleOption } from "./new/handleOption.mjs";

async function main(option, args) {
  // errorhandle args
  if (args.length < 1 && !["-h", "help", "--help"].includes(option)) {
    log.error("Must provide at least option and one argument\n");
    handleOption.help();
    process.exit(1);
  }

  // handle args
  switch (option) {
    case "-h":
    case "help":
    case "--help":
      handleOption.help();
      break;
    case "-c":
    case "component":
    case "--component":
      await handleOption.component(args);
      break;
    case "-p":
    case "page":
    case "--page":
      await handleOption.page(...args);
      break;
    default:
      log.error("Unrecognized option\n");
      handleOption.help();
      process.exit(1);
  }
}

// run
isRoot();
const [, , option, ...args] = process.argv;
main(option, args);
