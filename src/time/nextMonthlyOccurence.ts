import type { Spacetime } from "spacetime";
import { Global } from "src/types/enum";
import { msToSeconds } from "./msToSeconds";

/**
 * Finds next occurence of an event that occurs at a set day and hour each month (relative to UTC)
 * @param s Spacetime instance for current time
 * @param day Day of the month that the Event occurs
 * @param hour Hour (UTC) of the day the Event occurs
 * @returns Timestamp of next occurence in seconds
 */
export function nextMonthlyOccurence(s: Spacetime, day: number, hour: number) {
  const utc = s.goto(Global.UTC_TZ);
  let next: number;

  // if today's date is before day OR exactly the day, but hour is smaller
  if (utc.date() < day || (utc.date() === day && utc.hour() < hour)) {
    // reset is later this month
    // go forward to the start of the next day and add hours
    next = utc
      .date(day, true) // go forward to date of day
      .startOf("day") // reset to beginning of the day
      .add(hour, "hours").epoch; // and add hours
  } else {
    // reset for current month already happend
    // go to next month and add days and hours
    next = utc
      .next("month")
      .add(day - 1, "days") // -1 because months start on 1
      .add(hour, "hours").epoch; // but hours start at 0
  }

  return msToSeconds(next);
}
