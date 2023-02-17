import type { Diff } from "spacetime";

export function formatDiff(
  { days, hours, minutes, seconds }: Diff,
  fallback: string = "---"
): string {
  if (seconds <= 0) return fallback;

  return `${days == 0 ? "" : `${days}d `}${
    hours == 0 ? "" : `${hours % 24}h `
  }${minutes % 60}m ${seconds % 60}s`;
}

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
