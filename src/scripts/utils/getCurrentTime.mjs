export function getCurrentTime() {
  const now = Date.now();

  return Math.trunc(now / 1000);
}
