import { nextMonthlyOccurence } from "src/time/nextMonthlyOccurence";
import { useCurrentTime } from "./useCurrentTime";

interface RecurringEventProps {
  /**
   * Day of the month that the Event occurs
   */
  day: number;
  /**
   * Hour (UTC) of the day the Event occurs
   */
  hour: number;
}

/**
 * Finds next occurence of an event that occurs at a set day and hour each month (relative to UTC)
 * @returns Timestamp of next occurence in seconds
 */
export function useRecurringMonthly({ day, hour }: RecurringEventProps) {
  const { s } = useCurrentTime();
  return nextMonthlyOccurence(s, day, hour);
}
