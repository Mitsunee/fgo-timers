import type { Diff } from "spacetime";

export function formatDiff(diff: Diff, fallback: string = "---"): string {
  const { days, hours, minutes, seconds } = diff;

  if (seconds <= 0) return fallback;

  return `${days == 0 ? "" : `${days}d `}${
    hours == 0 ? "" : `${hours % 24}h `
  }${minutes % 60}m ${seconds % 60}s`;
}
