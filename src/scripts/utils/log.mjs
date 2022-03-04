import picocolors from "picocolors";

function _log(prefix, message, parent = false, color = false, level = "log") {
  const paddedPrefix = prefix.padEnd(5, " ");
  const coloredPrefix = color ? picocolors[color](paddedPrefix) : paddedPrefix;
  const fullMessage = `${coloredPrefix} - ${message}${
    parent ? picocolors.gray(` in '${parent}'`) : ""
  }`;
  console[level](fullMessage);
}

export function log(message, parent) {
  _log("log", message, parent);
}

export function info(message, parent) {
  _log("info", message, parent, "cyan");
}

export function warn(message, parent) {
  _log("warn", message, parent, "yellow", "warn");
}

export function error(message, parent) {
  _log("error", message, parent, "red", "error");
}

export function ready(message, parent) {
  _log("ready", message, parent, "green");
}
