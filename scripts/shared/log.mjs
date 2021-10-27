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

const log = (text, level = "log") => {
  // quit if there's no text, unless this log is a spinner success with no text
  if (!text) return;

  console[level](text);
};

// pre-colored loggers
log.error = text => log(error(text), "error");
log.warn = text => log(warn(text), "warn");
log.success = text => log(success(text), "log");

// info table logger
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
