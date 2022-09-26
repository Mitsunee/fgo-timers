// Remove Node's built-in `warning` listener which outputs all warnings to stderr
process.removeAllListeners("warning");

// Add our own version that skips known warnings
process.on("warning", warning => {
  const { name, message } = warning;
  if (
    (name === "ExperimentalWarning" &&
      message.indexOf("--experimental-loader") > -1) ||
    (name === "DeprecationWarning" &&
      message.indexOf("Obsolete loader hook") > -1)
  ) {
    return;
  }

  console.warn(warning);
});
