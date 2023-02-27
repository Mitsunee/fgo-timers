import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";

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
 * @returns Start time of next interval in seconds
 */
export function useRecurringInterval({
  length,
  offset
}: RecurringIntervalProps) {
  const { current } = useCurrentTime();
  const next = current - ((current - offset) % length) + length;
  return next;
}
