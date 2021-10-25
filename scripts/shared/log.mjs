import picocolors from "picocolors";

export function error(text) {
  if (text) return picocolors.red(text);
  return "";
}

export function warn(text) {
  if (text) return picocolors.yellow(text);
  return "";
}

export function success(text) {
  if (text) return picocolors.cyan(text);
  return "";
}

const log = (text, level = "log", spinner) => {
  // quit if there's no text, unless this log is a spinner success with no text
  if (!text && level !== "success" && !spinner) return;

  // if there's no spinner print log and quit
  if (!spinner) {
    console[level](text);
    return;
  }

  const opts = { text };

  if (level === "error") return spinner.error(opts);

  // override mark unless level actually is success
  if (level !== "success") {
    opts.mark = "\u200b"; // ZWS because empty string would be falsey
  }

  // print
  spinner.success(opts);

  // restart spinner if this wasn't a success
  if (level !== "success") spinner.start();
};

// spinner-compatible helpers
log.error = (text, spinner) => log(error(text), "error", spinner);
log.warn = (text, spinner) => log(warn(text), "warn", spinner);
log.success = (text, spinner) =>
  log(success(text), spinner ? "success" : "log", spinner);

// string-compatible table logger
log.table = arg => {
  if (typeof arg === "string") {
    return log(arg);
  }

  const temp = {};
  for (const key in arg) {
    temp[key] =
      typeof arg[key] === "object"
        ? arg[key] instanceof Array
          ? "array"
          : "object"
        : arg[key];
  }

  console.table(temp);
};

export { log };

export function die(text) {
  if (text) log.error(text);
  process.exit(1);
}
