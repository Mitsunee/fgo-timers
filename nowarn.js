// Remove Node's built-in `warning` listener which outputs all warnings to stderr
process.removeAllListeners("warning");

// Add our own version that skips known warnings
process.on("warning", warning => {
  const { name, message } = warning;
  // prettier-ignore
  if (
    (name == "ExperimentalWarning" && (
      message.indexOf("Custom ESM Loaders is an experimental feature") > -1 ||
      message.indexOf("--experimental-loader is an experimental feature" > -1)
    )) ||
    (name == "DeprecationWarning" &&
      message.indexOf("Obsolete loader hook") > -1)
  ) {
    return;
  }

  console.warn(warning);
});