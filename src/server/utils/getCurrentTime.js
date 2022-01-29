/* getCurrentTime
 * returns current UNIX timestamp in seconds
 */

export function getCurrentTime() {
  const now = Date.now();

  return Math.trunc(now / 1000);
}
