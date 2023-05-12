/**
 * Finds next occurence of a recurring interval
 * @param current Current time as timestamp in seconds
 * @param length length between intervals in seconds
 * @param offset offset subtracted from current time to modify start time of interval
 * @returns Timestamp of next occurence in seconds
 */
export function nextIntervalOccurence(
  current: number,
  length: number,
  offset: number
) {
  return current - ((current - offset) % length) + length;
}
