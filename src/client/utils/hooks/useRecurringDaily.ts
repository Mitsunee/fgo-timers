import { nextDailyOccurence } from "~/time/nextDailyOccurence";
import { useCurrentTime } from "./useCurrentTime";

/**
 * Finds the next occurence of a daily event
 * @param hour Hour (UTC) of daily occurence as number
 * @returns Timestamp of next occurence in seconds
 */
export function useRecurringDaily(hour: number) {
  const { s } = useCurrentTime();
  return nextDailyOccurence(s, hour);
}
