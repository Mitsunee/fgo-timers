import type { Diff } from "spacetime";

/**
 * Formats spacetime Diff as human readable string
 * @param diff Diff
 * @param fallback string to display if delta is 0 or less (default: "---")
 * @returns string
 */
export function formatDiff(
  { days, hours, minutes, seconds }: Diff,
  fallback = "---"
): string {
  if (seconds <= 0) return fallback;

  return `${days == 0 ? "" : `${days}d `}${
    hours == 0 ? "" : `${hours % 24}h `
  }${minutes % 60}m ${seconds % 60}s`;
}

/**
 * Formats Diff as datetime property compatible string or undefined if delta is 0 or less
 * @param diff Diff
 * @returns string or undefined
 */
export function diffToDateTimeAttribute({
  days,
  hours,
  minutes,
  seconds
}: Diff) {
  if (seconds <= 0) return;

  return `P${days == 0 ? "" : `${days}D`}T${
    hours == 0 ? "" : `${hours % 24}H`
  }${minutes % 60}M${seconds % 60}S`;
}
