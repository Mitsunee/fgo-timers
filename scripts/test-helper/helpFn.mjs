import { log, die } from "@foxkit/node-util/log";
import { dedent } from "foxkit/dedent";

const dd = dedent({
  trim: true,
  tabWidth: 2,
  useTabs: false
});

export function helpFn(isFallback = false) {
  if (isFallback) {
    log.error("Incorrect Arguments provided\n");
  }

  console.log(
    dd(`
    Usage: test-helper [option] [value] [flags]

    Options:
      is         Test if project is specific type (value: cjs or esm)
      set        Set project to specific module type (value: cjs or esm)
      precommit  Alias to 'test-helper is cjs --silent'
      reset      Alias to 'test-helper set cjs'
      help       display help for command

    Flags:
      --silent   Supress any logs, only print warns and errors
  `)
  );

  if (isFallback) die();
}
