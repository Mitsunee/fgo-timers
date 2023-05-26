import { normalizeDate } from "../time/normalizeDate";
import type { BundledEvent } from "./types";

/**
 * Creates sorter callback for events using given time as reference for wheter the event would be shown on HomePage
 * @param time current time in seconds
 * @returns callback function for `Array.prototype.sort`
 */
export function createEventSorter(time: number) {
  return (a: BundledEvent, b: BundledEvent) => {
    if (a.hideAt <= time && b.hideAt > time) return 1; // a ended, b didn't, sort a after b
    if (b.hideAt <= time && a.hideAt > time) return -1; // b ended, a didn't, sort a before b
    const [aStart] = normalizeDate(a.date);
    const [bStart] = normalizeDate(b.date);
    if (aStart == bStart) return b.hideAt - a.hideAt; // if start time equal sort by hide time instead
    return bStart - aStart;
  };
}
