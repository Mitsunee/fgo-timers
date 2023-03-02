import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { Global } from "src/types/enum";
import { msToSeconds } from "src/time/msToSeconds";

interface RecurringDailyProps {
  /**
   * Hour (UTC) of daily occurence
   */
  hour: number;
}

/**
 * Finds the next occurence of a daily event
 * @returns Time of next occurence in seconds
 */
export function useRecurringDaily({ hour }: RecurringDailyProps) {
  const { s } = useCurrentTime();
  const now = s.goto(Global.UTC_TZ);
  let next: number;

  // if hour hasn't passed yet
  if (now.hour() < hour) {
    // reset is later today
    next = now
      .startOf("day") // reset to beginning of today
      .add(hour, "hours").epoch; // and add hours
  } else {
    // reset for current day already happend
    next = now
      .next("day") // go forward to tomorrow
      .startOf("day") // reset to beginning of the day
      .add(hour, "hours").epoch; // and add hours
  }

  return msToSeconds(next);
}