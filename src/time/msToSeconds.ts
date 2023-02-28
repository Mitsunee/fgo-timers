/**
 * Truncates time to seconds
 * @param time time in milliseconds
 * @returns number (time in seconds)
 */
export function msToSeconds(time: number) {
  return Math.trunc(time / 1000);
}
