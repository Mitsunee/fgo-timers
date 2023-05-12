import type { Spacetime } from "spacetime";
import { Global } from "src/types/enum";
import { msToSeconds } from "./msToSeconds";

/**
 * Finds the next occurence of a daily event
 * @param s Spacetime instance for current time
 * @param hour Hour (UTC) of daily occurence as number
 * @returns Timestamp of next occurence in seconds
 */
export function nextDailyOccurence(s: Spacetime, hour: number) {
  const utc = s.goto(Global.UTC_TZ);
  let next: number;

  // if hour hasn't passed yet
  if (utc.hour() < hour) {
    // reset is later today
    next = utc
      .startOf("day") // reset to beginning of today
      .add(hour, "hours").epoch; // and add hours
  } else {
    // reset for current day already happend
    next = utc
      .next("day") // go forward to tomorrow
      .startOf("day") // reset to beginning of the day
      .add(hour, "hours").epoch; // and add hours
  }

  return msToSeconds(next);
}
