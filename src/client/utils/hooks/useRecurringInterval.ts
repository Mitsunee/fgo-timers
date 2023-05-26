import { nextIntervalOccurence } from "~/time/nextIntervalOccurence";
import { useCurrentTime } from "./useCurrentTime";

interface RecurringIntervalProps {
  /**
   * length between intervals in seconds
   */
  length: number;
  /**
   * offset subtracted from current time to modify start time of intervals
   */
  offset: number;
}

/**
 * Finds next occurence of a recurring interval
 * @returns Timestamp of next occurence in seconds
 */
export function useRecurringInterval({
  length,
  offset
}: RecurringIntervalProps) {
  const { current } = useCurrentTime();
  return nextIntervalOccurence(current, length, offset);
}
