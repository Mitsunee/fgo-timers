import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { Global } from "src/types/enum";
import { msToSeconds } from "src/time/msToSeconds";

interface RecurringEventProps {
  /**
   * Day of the month that the Event occurs
   */
  day: number;
  /**
   * Hour of the day the Event occurs
   */
  hour: number;
}

/**
 * Finds next occurence of an event that occurs at a set day and hour each month (relative to UTC)
 * @returns Time of next occurence in seconds
 */
export function useRecurringEvent({ day, hour }: RecurringEventProps) {
  const { s } = useCurrentTime();
  const now = s.goto(Global.UTC_TZ);
  let next: number;

  // if today's date is before day OR exactly the day, but hour is smaller
  if (now.date() < day || (now.date() === day && now.hour() < hour)) {
    // reset is later this month
    // go forward to the start of the next day and add hours
    next = now
      .date(day, true) // go forward to date of day
      .startOf("day") // reset to beginning of the day
      .add(hour, "hours").epoch; // and add hours
  } else {
    // reset for current month already happend
    // go to next month and add days and hours
    next = now
      .next("month")
      .add(day - 1, "days") // -1 because months start on 1
      .add(hour, "hours").epoch; // but hours start at 0
  }

  return msToSeconds(next);
}
